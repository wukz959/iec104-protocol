declare const currentTime: any

export function clientConnection(Lib60870) {
    class ClientConnection extends Lib60870.prototype.IMasterConnection {
        connectionsCounter = 0
        connectionID

        DebugLog(msg) {
            if (this.debugOutput) {
                console.warn('CS104 SLAVE CONNECTION ' + this.connectionID + ': ' + msg)
            }
        }

        STARTDT_CON_MSG = new Uint8Array(6)
        STOPDT_CON_MSG = new Uint8Array(6)
        TESTFR_CON_MSG = new Uint8Array(6)
        TESTFR_ACT_MSG = new Uint8Array(6)

        sendCount = 0
        receiveCount = 0
        unconfirmedReceivedIMessages = 0
        nextT3Timeout
        waitingForTestFRcon = false
        nextTestFRConTimeout = 0
        timeoutT2Triggered = false
        lastConfirmationTime = Number.MAX_SAFE_INTEGER
        tlsSecInfo = null
        apciParameters
        alParameters
        server
        receivedASDUs: any = null
        callbackThread = null
        callbackThreadRunning = false
        waitingASDUsHighPrio: any = null

        SentASDU = class {
            entryTime
            queueIndex
            sentTime
            seqNo
        }

        maxSentASDUs: any = 12
        oldestSentASDU: any = -1
        newestSentASDU: any = -1
        sentASDUs: any = null
        asduQueue: any = null
        fileServer

        GetASDUQueue() {
            return this.asduQueue
        }

        TryDequeue(queue) {
            let asdu = null
            if (queue.length > 0) {
                asdu = queue[0]
                queue.shift()
            }
            return asdu
        }

        Enqueue(queue, asdu) {
            queue.push(asdu)
            return true
        }

        ProcessASDUs() {
            this.callbackThreadRunning = true
            //while (this.callbackThreadRunning) {
                try {
                    while ((this.receivedASDUs.length > 0) && (this.callbackThreadRunning) && (this.running)) {
                        let asdu
                        if (asdu = this.TryDequeue(this.receivedASDUs)) {
                            if (asdu != null) {
                                this.HandleASDU(asdu)
                            }
                        }
                    }
                    //Thread.Sleep(50);
                } catch (e) {
                    this.DebugLog('Failed to parse ASDU --> close connection')
                    this.running = false
                }
            //}
            //this.DebugLog("ProcessASDUs exit thread");
        }

        remoteEndpoint

        get RemoteEndpoint() {
            return this.remoteEndpoint
        }

        constructor(socket, tlsSecInfo, apciParameters, parameters, server, asduQueue, debugOutput) {
            super()

            this.STARTDT_CON_MSG[0] = 0x68
            this.STARTDT_CON_MSG[1] = 0x04
            this.STARTDT_CON_MSG[2] = 0x0b

            this.STOPDT_CON_MSG[0] = 0x68
            this.STOPDT_CON_MSG[1] = 0x04
            this.STOPDT_CON_MSG[2] = 0x23

            this.TESTFR_CON_MSG[0] = 0x68
            this.TESTFR_CON_MSG[1] = 0x04
            this.TESTFR_CON_MSG[2] = 0x83

            this.TESTFR_ACT_MSG[0] = 0x68
            this.TESTFR_ACT_MSG[1] = 0x04
            this.TESTFR_ACT_MSG[2] = 0x43

            this.connectionsCounter++
            this.connectionID = this.connectionsCounter

            this.remoteEndpoint = new Lib60870.prototype.IPEndPoint(socket.RemoteEndPoint)
            this.apciParameters = apciParameters
            this.alParameters = parameters
            this.server = server
            this.asduQueue = asduQueue
            this.debugOutput = debugOutput

            this.ResetT3Timeout(Lib60870.prototype.GetUInt64Value(new Date().valueOf()))
            this.maxSentASDUs = this.apciParameters.K
            this.sentASDUs = new Array(this.maxSentASDUs)
            this.receivedASDUs = [] //new Lib60870.prototype.ConcurrentQueue();
            this.waitingASDUsHighPrio = [] //new Lib60870.prototype.Queue();
            this.socketStream = new Lib60870.prototype.NetworkStream(socket)
            this.socket = socket
            this.tlsSecInfo = tlsSecInfo
            socket.resume()
            const $this = this
            socket.on('data', data => {
                $this.running = true
                $this.currentReadTimeout = new Date().valueOf() + $this.server.ReceiveTimeout
                $this.receiveMessage(data)
                $this.HandleMessage(data, data.length)
                if ($this.running) {
                    if ($this.isActive) {
                        $this.SendWaitingASDUs()
                    }
                }
            })

            socket.on('error', function (data) {
                socket.end()
                $this.running = false
            })

            socket.on('close', function (data) {
                socket.end()
                $this.server.Remove($this)
                //$this.running = false;
            })

            socket.on('end', function () {
                console.log('Disconnected from server')
            })

            /*
            this.fileServer = new Lib60870.prototype.FileServer(this, this.server.GetAvailableFiles(), this.DebugLog);
            if (this.server.fileTimeout != null) {
                this.fileServer.Timeout = Lib60870.prototype.GetLongValue(this.server.fileTimeout);
            }
            this.fileServer.SetFileReadyHandler(this.server.fileReadyHandler, this.server.fileReadyHandlerParameter);
            */
            //const { Worker } = require("worker_threads");
            //const worker = new Worker("./handle-connection.js", {workerData: {}}); //{socket: this.socket, tlsSecInfo: this.tlsSecInfo, apciParameters: this.apciParameters, alParameters: this.alParameters, server: this.server, asduQueue: this.asduQueue, debugOutput: this.debugOutput}});
            //const workerThread = this.HandleConnection();
            //Thread workerThread = new Thread(HandleConnection);
            //workerThread.Start();
        }

        GetApplicationLayerParameters() {
            return this.alParameters
        }

        ResetT3Timeout(currentTime) {
            this.nextT3Timeout = Lib60870.prototype.GetUInt64Value(new Date().valueOf()) + Lib60870.prototype.GetUInt64Value((this.apciParameters.T3 * 1000))
        }

        CheckT3Timeout(currentTime) {
            if (this.waitingForTestFRcon) {
                return false
            }
            if (this.nextT3Timeout > (currentTime + Lib60870.prototype.GetUInt64Value((this.apciParameters.T3 * 1000)))) {
                this.ResetT3Timeout(currentTime)
            }
            if (currentTime > this.nextT3Timeout) {
                return true
            } else {
                return false
            }
        }

        ResetTestFRConTimeout(currentTime) {
            this.nextTestFRConTimeout = currentTime + Lib60870.prototype.GetUInt64Value((this.apciParameters.T1 * 1000))
        }

        CheckTestFRConTimeout(currentTime) {
            if (this.nextTestFRConTimeout > (currentTime + Lib60870.prototype.GetUInt64Value((this.apciParameters.T1 * 1000)))) {
                this.ResetTestFRConTimeout(currentTime)
            }
            if (currentTime > this.nextTestFRConTimeout) {
                return true
            } else {
                return false
            }
        }

        isActive = false

        get IsActive() {
            return this.isActive
        }
        set IsActive(value) {
            if (this.isActive != value) {
                this.isActive = value
                if (this.isActive) {
                    this.DebugLog('is active')
                } else {
                    this.DebugLog('is not active')
                }
            }
        }

        socket
        socketStream

        running = false

        debugOutput = true

        readState = 0 //0 - idle, 1 - start received, 2 - reading remaining bytes
        currentReadPos = 0
        currentReadMsgLength = 0
        remainingReadLength = 0
        currentReadTimeout = 0

        receiveMessage(buffer) {
            try {
                if (this.readState != 0) {
                    if (new Date().valueOf() > this.currentReadTimeout) {
                        this.DebugLog('Receive timeout!')
                        return -1
                    }
                }
                //if (this.socket.Poll(50, SelectMode.SelectRead)) {
                if (this.readState == 0) {
                    // wait for start byte
                    if (this.socketStream.Read(buffer, 0, 1) != 1) {
                        return -1
                    }
                    if (buffer[0] != 0x68) {
                        this.DebugLog('Missing SOF indicator!')
                        return -1
                    }
                    this.readState = 1
                }
                if (this.readState == 1) {
                    if (this.socketStream.Read(buffer, 1, 1) != 1) {
                        return 0
                    }
                    this.currentReadMsgLength = buffer[1]
                    this.remainingReadLength = this.currentReadMsgLength
                    this.currentReadPos = 2
                    this.readState = 2
                }
                if (this.readState == 2) {
                    const readLength = this.socketStream.Read(buffer, this.currentReadPos, this.remainingReadLength)
                    if (readLength == this.remainingReadLength) {
                        this.readState = 0
                        this.currentReadTimeout = 0
                        return 2 + this.currentReadMsgLength
                    } else {
                        this.currentReadPos += readLength
                        this.remainingReadLength = this.remainingReadLength - readLength
                    }
                }
                if (this.currentReadTimeout == 0) {
                    this.currentReadTimeout = new Date().valueOf() + this.server.ReceiveTimeout
                }
                //}
            } catch (e) {
                console.warn(e)
            }
            return 0
        }

        SendSMessage() {
            this.DebugLog('Send S message')
            const msg = new Uint8Array(6)

            msg[0] = 0x68
            msg[1] = 0x04
            msg[2] = 0x01
            msg[3] = 0

            //lock (socketStream) {
                msg[4] = Lib60870.prototype.GetByteValue(((this.receiveCount % 128) * 2))
                msg[5] = Lib60870.prototype.GetByteValue((this.receiveCount / 128))
                try {
                    this.socketStream.Write(msg, 0, msg.length)
                } catch (e) {
                    // socket error --> close connection
                    this.running = false
                }
            //}
        }

        SendIMessage(asdu) {
            const buffer = asdu.GetBuffer()
            const msgSize = asdu.GetMsgSize()
            buffer[0] = 0x68
            buffer[1] = Lib60870.prototype.GetByteValue((msgSize - 2))
            buffer[2] = Lib60870.prototype.GetByteValue(((this.sendCount % 128) * 2))
            buffer[3] = Lib60870.prototype.GetByteValue((this.sendCount / 128))
            buffer[4] = Lib60870.prototype.GetByteValue(((this.receiveCount % 128) * 2))
            buffer[5] = Lib60870.prototype.GetByteValue((this.receiveCount / 128))
            try {
                //lock (socketStream) {
                    this.socketStream.Write(buffer, 0, msgSize)
                    this.DebugLog('SEND I (size = ' + msgSize + ') : ') //+BitConverter.ToString(buffer, 0, msgSize));
                    this.sendCount = (this.sendCount + 1) % 32768
                    this.unconfirmedReceivedIMessages = 0
                    this.timeoutT2Triggered = false
                //}
            } catch (e) {
                // socket error --> close connection
                this.running = false
            }
            return this.sendCount
        }

        isSentBufferFull() {
            if (this.oldestSentASDU == -1) {
                return false
            }
            const newIndex = (this.newestSentASDU + 1) % this.maxSentASDUs
            if (newIndex == this.oldestSentASDU) {
                return true
            } else {
                return false
            }
        }

        PrintSendBuffer() {
            if (this.debugOutput) {
                if (this.oldestSentASDU != -1) {
                    let currentIndex = this.oldestSentASDU
                    let nextIndex = 0
                    this.DebugLog('------k-buffer------')
                    let count = 0
                    do {
                        this.DebugLog(currentIndex + ' : S ' + this.sentASDUs[currentIndex].seqNo + ' : time ' + this.sentASDUs[currentIndex].sentTime + ' : ' + this.sentASDUs[currentIndex].queueIndex)
                        if (currentIndex == this.newestSentASDU) {
                            nextIndex = -1
                        } else {
                            currentIndex = (currentIndex + 1) % this.maxSentASDUs
                        }
                        count++
                    } while (nextIndex != -1 && count < this.maxSentASDUs)
                    this.DebugLog('--------------------')
                }
            }
        }

        sendNextAvailableASDU() {
            //lock (sentASDUs) {
                if (this.isSentBufferFull()) {
                    return
                }
                this.asduQueue.LockASDUQueue()
                const result = this.asduQueue.GetNextWaitingASDU()
                const asdu = result.asdu
                const timestamp = result.timestamp
                const index = result.index
                //console.warn(timestamp, index);
                try {
                    if (asdu != null) {
                        let currentIndex = 0
                        if (this.oldestSentASDU == -1) {
                            this.oldestSentASDU = 0
                            this.newestSentASDU = 0
                        } else {
                            currentIndex = (this.newestSentASDU + 1) % this.maxSentASDUs
                        }
                        this.sentASDUs[currentIndex] = new this.SentASDU()
                        this.sentASDUs[currentIndex].entryTime = timestamp
                        this.sentASDUs[currentIndex].queueIndex = index
                        this.sentASDUs[currentIndex].seqNo = this.SendIMessage(asdu)
                        this.sentASDUs[currentIndex].sentTime = new Date().valueOf()
                        this.newestSentASDU = currentIndex
                        this.PrintSendBuffer()
                    }
                } catch (e) { }
                this.asduQueue.UnlockASDUQueue()
            //}
        }

        sendNextHighPriorityASDU() {
            //lock (sentASDUs) {
                if (this.isSentBufferFull()) {
                    return false
                }
                const asdu = this.TryDequeue(this.waitingASDUsHighPrio)
                if (asdu != null) {
                    let currentIndex = 0
                    if (this.oldestSentASDU == -1) {
                        this.oldestSentASDU = 0
                        this.newestSentASDU = 0
                    } else {
                        currentIndex = (this.newestSentASDU + 1) % this.maxSentASDUs
                    }
                    this.sentASDUs[currentIndex] = {}
                    this.sentASDUs[currentIndex].queueIndex = -1
                    this.sentASDUs[currentIndex].seqNo = this.SendIMessage(asdu)
                    this.sentASDUs[currentIndex].sentTime = new Date().valueOf()
                    this.newestSentASDU = currentIndex
                    this.PrintSendBuffer()
                } else {
                    return false
                }
            //}
            return true
        }

        SendWaitingASDUs() {
            //lock (waitingASDUsHighPrio) {
                //console.warn('SendWaitingASDUs', this.waitingASDUsHighPrio.length);
                while (this.waitingASDUsHighPrio.length > 0) {
                    if (this.sendNextHighPriorityASDU() == false) {
                        return
                    }
                    if (this.running == false) {
                        return
                    }
                }
            //}
            this.sendNextAvailableASDU()
        }

        SendASDUInternal(asdu) {
            if (this.isActive) {
                //lock (waitingASDUsHighPrio) {
                    //console.warn(asdu);
                    const frame = new Lib60870.prototype.BufferFrame(new Uint8Array(256), 6)
                    asdu.Encode(frame, this.alParameters)
                    this.Enqueue(this.waitingASDUsHighPrio, frame)
                //}
                this.SendWaitingASDUs()
            }
        }

        SendASDU(asdu) {
            if (this.isActive) {
                this.SendASDUInternal(asdu)
            } else {
                throw new Lib60870.prototype.ConnectionException('Connection not active')
            }
        }

        SendACT_CON(asdu, negative) {
            asdu.Cot = Lib60870.prototype.CauseOfTransmission.ACTIVATION_CON
            asdu.IsNegative = negative
            this.SendASDU(asdu)
        }

        SendACT_TERM(asdu) {
            asdu.Cot = Lib60870.prototype.CauseOfTransmission.ACTIVATION_TERMINATION
            asdu.IsNegative = false
            this.SendASDU(asdu)
        }

        HandleASDU(asdu) {
            this.DebugLog('Handle received ASDU')
            let messageHandled = false
            //console.warn(asdu.TypeId);
            try {
                switch (asdu.TypeId) {
                    case Lib60870.prototype.TypeID.C_IC_NA_1: //100 - interrogation command
                        this.DebugLog('Rcvd interrogation command C_IC_NA_1')
                        if ((asdu.Cot == Lib60870.prototype.CauseOfTransmission.ACTIVATION) || (asdu.Cot == Lib60870.prototype.CauseOfTransmission.DEACTIVATION)) {
                            if (this.server.interrogationHandler != null) {
                                const irc = Lib60870.prototype.GetInterrogationCommandValue(asdu.GetElement(0))
                                if (this.server.interrogationHandler(this.server.InterrogationHandlerParameter, this, asdu, irc.QOI)) {
                                    messageHandled = true
                                }
                            }
                        } else {
                            asdu.Cot = Lib60870.prototype.CauseOfTransmission.UNKNOWN_CAUSE_OF_TRANSMISSION
                            asdu.IsNegative = true
                            this.SendASDUInternal(asdu)
                        }
                        break
                    case Lib60870.prototype.TypeID.C_CI_NA_1: //101 - counter interrogation command
                        this.DebugLog('Rcvd counter interrogation command C_CI_NA_1')
                        if ((asdu.Cot == Lib60870.prototype.CauseOfTransmission.ACTIVATION) || (asdu.Cot == Lib60870.prototype.CauseOfTransmission.DEACTIVATION)) {
                            if (this.server.counterInterrogationHandler != null) {
                                const cic = Lib60870.prototype.GetCounterInterrogationCommandValue(asdu.GetElement(0))
                                if (this.server.counterInterrogationHandler(this.server.counterInterrogationHandlerParameter, this, asdu, cic.QCC)) {
                                    messageHandled = true
                                }
                            }
                        } else {
                            asdu.Cot = Lib60870.prototype.CauseOfTransmission.UNKNOWN_CAUSE_OF_TRANSMISSION
                            asdu.IsNegative = true
                            this.SendASDUInternal(asdu)
                        }
                        break
                    case Lib60870.prototype.TypeID.C_RD_NA_1: //102 - read command
                        this.DebugLog('Rcvd read command C_RD_NA_1')
                        if (asdu.Cot == Lib60870.prototype.CauseOfTransmission.REQUEST) {
                            this.DebugLog('Read request for object: ' + asdu.Ca)
                            if (this.server.readHandler != null) {
                                const rc = Lib60870.prototype.GetReadCommandValue(asdu.GetElement(0))
                                if (this.server.readHandler(this.server.readHandlerParameter, this, asdu, rc.ObjectAddress)) {
                                    messageHandled = true
                                }
                            }
                        } else {
                            asdu.Cot = Lib60870.prototype.CauseOfTransmission.UNKNOWN_CAUSE_OF_TRANSMISSION
                            asdu.IsNegative = true
                            this.SendASDUInternal(asdu)
                        }
                        break
                    case Lib60870.prototype.TypeID.C_CS_NA_1: //103 - Clock synchronization command
                        this.DebugLog('Rcvd clock sync command C_CS_NA_1')
                        if (asdu.Cot == Lib60870.prototype.CauseOfTransmission.ACTIVATION) {
                            if (this.server.clockSynchronizationHandler != null) {
                                const csc = Lib60870.prototype.GetClockSynchronizationCommandValue(asdu.GetElement(0))
                                if (this.server.clockSynchronizationHandler(this.server.clockSynchronizationHandlerParameter, this, asdu, csc.NewTime)) {
                                    messageHandled = true
                                }
                            }
                        } else {
                            asdu.Cot = Lib60870.prototype.CauseOfTransmission.UNKNOWN_CAUSE_OF_TRANSMISSION
                            asdu.IsNegative = true
                            this.SendASDUInternal(asdu)
                        }
                        break
                    case Lib60870.prototype.TypeID.C_TS_NA_1: //104 - test command
                        this.DebugLog('Rcvd test command C_TS_NA_1')
                        if (asdu.Cot != Lib60870.prototype.CauseOfTransmission.ACTIVATION) {
                            asdu.Cot = Lib60870.prototype.CauseOfTransmission.UNKNOWN_CAUSE_OF_TRANSMISSION
                            asdu.IsNegative = true
                        } else {
                            asdu.Cot = Lib60870.prototype.CauseOfTransmission.ACTIVATION_CON
                        }
                        this.SendASDUInternal(asdu)
                        messageHandled = true
                        break
                    case Lib60870.prototype.TypeID.C_RP_NA_1: //105 - Reset process command
                        this.DebugLog('Rcvd reset process command C_RP_NA_1')
                        if (asdu.Cot == Lib60870.prototype.CauseOfTransmission.ACTIVATION) {
                            if (this.server.resetProcessHandler != null) {
                                const rpc = Lib60870.prototype.GetResetProcessCommandValue(asdu.GetElement(0))
                                if (this.server.resetProcessHandler(this.server.resetProcessHandlerParameter, this, asdu, rpc.QRP)) {
                                    messageHandled = true
                                }
                            }
                        } else {
                            asdu.Cot = Lib60870.prototype.CauseOfTransmission.UNKNOWN_CAUSE_OF_TRANSMISSION
                            asdu.IsNegative = true
                            this.SendASDUInternal(asdu)
                        }
                        break
                    case Lib60870.prototype.TypeID.C_CD_NA_1: //106 - Delay acquisition command
                        this.DebugLog('Rcvd delay acquisition command C_CD_NA_1')
                        if ((asdu.Cot == Lib60870.prototype.CauseOfTransmission.ACTIVATION) || (asdu.Cot == Lib60870.prototype.CauseOfTransmission.SPONTANEOUS)) {
                            if (this.server.delayAcquisitionHandler != null) {
                                const dac = Lib60870.prototype.GetDelayAcquisitionCommandValue(asdu.GetElement(0))
                                if (this.server.delayAcquisitionHandler(this.server.delayAcquisitionHandlerParameter, this, asdu, dac.Delay)) {
                                    messageHandled = true
                                }
                            }
                        } else {
                            asdu.Cot = Lib60870.prototype.CauseOfTransmission.UNKNOWN_CAUSE_OF_TRANSMISSION
                            asdu.IsNegative = true
                            this.SendASDUInternal(asdu)
                        }
                        break
                }
                /*if (messageHandled == false) {
                    messageHandled = this.fileServer.HandleFileAsdu(asdu);
                }*/
                if ((messageHandled == false) && (this.server.asduHandler != null)) {
                    if (this.server.asduHandler(this.server.asduHandlerParameter, this, asdu)) {
                        messageHandled = true
                    }
                }
                if (messageHandled == false) {
                    asdu.Cot = Lib60870.prototype.CauseOfTransmission.UNKNOWN_TYPE_ID
                    asdu.IsNegative = true
                    this.SendASDUInternal(asdu)
                }
            } catch (e) {
                console.warn('Handle ASDU Exception: ' + e)
            }
        }

        CheckSequenceNumber(seqNo) {
            //lock (sentASDUs) {
                let seqNoIsValid = false
                let counterOverflowDetected = false
                let oldestValidSeqNo = -1
                if (this.oldestSentASDU == -1) {
                    if (seqNo == this.sendCount) {
                        seqNoIsValid = true
                    }
                } else {
                    if (this.sentASDUs[this.oldestSentASDU].seqNo <= this.sentASDUs[this.newestSentASDU].seqNo) {
                        if ((seqNo >= this.sentASDUs[this.oldestSentASDU].seqNo) && (seqNo <= this.sentASDUs[this.newestSentASDU].seqNo)) {
                            seqNoIsValid = true
                        }
                    } else {
                        if ((seqNo >= this.sentASDUs[this.oldestSentASDU].seqNo) || (seqNo <= this.sentASDUs[this.newestSentASDU].seqNo)) {
                            seqNoIsValid = true
                        }
                        counterOverflowDetected = true
                    }
                    if (this.sentASDUs[this.oldestSentASDU].seqNo == 0) {
                        oldestValidSeqNo = 32767
                    } else {
                        oldestValidSeqNo = this.sentASDUs[this.oldestSentASDU].seqNo - 1
                    }
                    if (oldestValidSeqNo == seqNo) {
                        seqNoIsValid = true
                    }
                }
                if (seqNoIsValid == false) {
                    this.DebugLog('Received sequence number out of range')
                    return false
                }
                if (this.oldestSentASDU != -1) {
                    do {
                        if (counterOverflowDetected == false) {
                            if (seqNo < this.sentASDUs[this.oldestSentASDU].seqNo) {
                                break
                            }
                        }
                        if (seqNo == oldestValidSeqNo) {
                            break
                        }
                        if (this.sentASDUs[this.oldestSentASDU].queueIndex != -1) {
                            this.asduQueue.MarkASDUAsConfirmed(this.sentASDUs[this.oldestSentASDU].queueIndex, this.sentASDUs[this.oldestSentASDU].entryTime)
                        }
                        if (this.sentASDUs[this.oldestSentASDU].seqNo == seqNo) {
                            if (this.oldestSentASDU == this.newestSentASDU) {
                                this.oldestSentASDU = -1
                            } else {
                                this.oldestSentASDU = (this.oldestSentASDU + 1) % this.maxSentASDUs
                            }
                            break
                        }
                        this.oldestSentASDU = (this.oldestSentASDU + 1) % this.maxSentASDUs
                        const checkIndex = (this.newestSentASDU + 1) % this.maxSentASDUs
                        if (this.oldestSentASDU == checkIndex) {
                            this.oldestSentASDU = -1
                            break
                        }
                    } while (true)
                }
            //}
            return true
        }

        HandleMessage(buffer, msgSize) {
            try {
                const currentTime = Lib60870.prototype.GetUInt64Value(new Date().valueOf())
                if ((buffer[2] & 1) == 0) {
                    if (msgSize < 7) {
                        this.DebugLog('I msg too small!')
                        return false
                    }
                    if (this.timeoutT2Triggered == false) {
                        this.timeoutT2Triggered = true
                        this.lastConfirmationTime = currentTime //start timeout T2
                    }
                    const frameSendSequenceNumber = ((buffer[3] * 0x100) + (buffer[2] & 0xfe)) / 2
                    const frameRecvSequenceNumber = ((buffer[5] * 0x100) + (buffer[4] & 0xfe)) / 2
                    this.DebugLog('Received I frame: N(S) = ' + frameSendSequenceNumber + ' N(R) = ' + frameRecvSequenceNumber)
                    //check the receive sequence number N(R) - connection will be closed on an unexpected value
                    if (frameSendSequenceNumber != this.receiveCount) {
                        this.DebugLog('Sequence error: Close connection!')
                        return false
                    }
                    if (this.CheckSequenceNumber(frameRecvSequenceNumber) == false) {
                        this.DebugLog('Sequence number check failed')
                        return false
                    }
                    this.receiveCount = (this.receiveCount + 1) % 32768
                    this.unconfirmedReceivedIMessages++
                    if (this.isActive) {
                        try {
                            const asdu = new Lib60870.prototype.ASDU(this.alParameters, buffer, 6, msgSize)
                            this.DebugLog('Enqueue received I-message for processing')
                            this.receivedASDUs.push(asdu)
                            this.ProcessASDUs()
                        } catch (e) {
                            this.DebugLog('ASDU parsing failed: ' + e)
                            return false
                        }
                    } else {
                        this.DebugLog('Connection not active -> close connection')
                        return false
                    }
                } else if ((buffer[2] & 0x43) == 0x43) {
                    this.DebugLog('Send TESTFR_CON')
                    this.socketStream.Write(this.TESTFR_CON_MSG, 0, this.TESTFR_CON_MSG.length)
                } else if ((buffer[2] & 0x07) == 0x07) {
                    this.DebugLog('Send STARTDT_CON')
                    if (this.isActive == false) {
                        this.isActive = true
                        this.server.Activated(this)
                    }
                    this.socketStream.Write(this.STARTDT_CON_MSG, 0, this.TESTFR_CON_MSG.length)
                } else if ((buffer[2] & 0x13) == 0x13) {
                    this.DebugLog('Send STOPDT_CON')
                    if (this.isActive == true) {
                        this.isActive = false
                        this.server.Deactivated(this)
                    }
                    this.socketStream.Write(this.STOPDT_CON_MSG, 0, this.TESTFR_CON_MSG.length)
                } else if ((buffer[2] & 0x83) == 0x83) {
                    this.DebugLog('Recv TESTFR_CON')
                    this.waitingForTestFRcon = false
                    this.ResetT3Timeout(currentTime)
                } else if (buffer[2] == 0x01) {
                    if (this.isActive == false) {
                        this.DebugLog('Connection not active -> close connection')
                        return false
                    }
                    const seqNo = (buffer[4] + buffer[5] * 0x100) / 2
                    this.DebugLog('Recv S(' + seqNo + ') (own sendcounter = ' + this.sendCount + ')')
                    if (this.CheckSequenceNumber(seqNo) == false) {
                        return false
                    }
                } else {
                    this.DebugLog('Unknown message')
                }
            } catch (e) {
                console.warn(e)
                //this.running = false;
            }
            this.ResetT3Timeout(currentTime)
            return true
        }
        /*
        private bool handleTimeouts()
        {
            UInt64 currentTime = (UInt64)SystemUtils.currentTimeMillis();

            if (CheckT3Timeout(currentTime))
            {
                try
                {
                    socketStream.Write(TESTFR_ACT_MSG, 0, TESTFR_ACT_MSG.Length);

                    DebugLog("U message T3 timeout");
                    ResetT3Timeout(currentTime);
                }
                catch (System.IO.IOException)
                {
                    running = false;
                }

                waitingForTestFRcon = true;

                ResetTestFRConTimeout(currentTime);
            }

            //Check for TEST FR con timeout
            if (waitingForTestFRcon)
            {
                if (CheckTestFRConTimeout(currentTime))
                {
                    DebugLog("Timeout for TESTFR_CON message");

                    // close connection
                    return false;
                }
            }

            if (unconfirmedReceivedIMessages > 0)
            {

                if ((currentTime - lastConfirmationTime) >= (UInt64)(apciParameters.T2 * 1000))
                {

                    lastConfirmationTime = currentTime;
                    unconfirmedReceivedIMessages = 0;
                    timeoutT2Triggered = false;
                    SendSMessage();
                }
            }

            //check if counterpart confirmed I messages
            lock (sentASDUs)
            {

                if (oldestSentASDU != -1)
                {

                    if (((long)currentTime - sentASDUs[oldestSentASDU].sentTime) >= (apciParameters.T1 * 1000))
                    {

                        PrintSendBuffer();
                        DebugLog("I message timeout for " + oldestSentASDU + " seqNo: " + sentASDUs[oldestSentASDU].seqNo);
                        return false;
                    }
                }
            }

            return true;
        }


        private bool AreByteArraysEqual(byte[] array1, byte[] array2)
        {
            if (array1.Length == array2.Length)
            {

                for (int i = 0; i < array1.Length; i++)
                {
                    if (array1[i] != array2[i])
                        return false;
                }

                return true;
            }
            else
                return false;
        }

        public bool CertificateValidationCallback(object sender, X509Certificate cert, X509Chain chain, SslPolicyErrors sslPolicyErrors)
        {
            if (sslPolicyErrors == SslPolicyErrors.None || sslPolicyErrors == SslPolicyErrors.RemoteCertificateChainErrors)
            {

                if (tlsSecInfo.ChainValidation)
                {

                    X509Chain newChain = new X509Chain();

                    newChain.ChainPolicy.RevocationMode = X509RevocationMode.NoCheck;
                    newChain.ChainPolicy.RevocationFlag = X509RevocationFlag.ExcludeRoot;
                    newChain.ChainPolicy.VerificationFlags = X509VerificationFlags.AllowUnknownCertificateAuthority;
                    newChain.ChainPolicy.VerificationTime = DateTime.Now;
                    newChain.ChainPolicy.UrlRetrievalTimeout = new TimeSpan(0, 0, 0);

                    foreach (X509Certificate2 caCert in tlsSecInfo.CaCertificates)
                    newChain.ChainPolicy.ExtraStore.Add(caCert);

                    bool certificateStatus = newChain.Build(new X509Certificate2(cert.GetRawCertData()));

                    if (certificateStatus == false)
                        return false;
                }

                if (tlsSecInfo.AllowOnlySpecificCertificates)
                {

                    foreach (X509Certificate2 allowedCert in tlsSecInfo.AllowedCertificates)
                    {
                        if (AreByteArraysEqual(allowedCert.GetCertHash(), cert.GetCertHash()))
                        {
                            return true;
                        }
                    }

                    return false;
                }

                return true;
            }
            else
                return false;
        }
        */
        HandleConnection() {
            const bytes = new Uint8Array(300)
            /*try {
                try {
                    this.running = true;
                    console.warn(this.tlsSecInfo);
                    if (this.tlsSecInfo != null) {
                        this.DebugLog("Setup TLS");
                        const validationCallback = this.CertificateValidationCallback;
                        if (this.tlsSecInfo.CertificateValidationCallback != null) {
                            validationCallback = this.tlsSecInfo.CertificateValidationCallback;
                        }
                        const sslStream = null; //new SslStream(socketStream, true, validationCallback);
                        const authenticationSuccess = false;
                        try {
                            sslStream.AuthenticateAsServer(tlsSecInfo.OwnCertificate, true, System.Security.Authentication.SslProtocols.Tls, false);
                            if (sslStream.IsAuthenticated == true) {
                                this.socketStream = sslStream;
                                authenticationSuccess = true;
                            }
                        } catch (e) {
                            this.DebugLog("TLS authentication error: " + e);
                        }
                        if (authenticationSuccess == true) {
                            this.socketStream = sslStream;
                        } else {
                            this.DebugLog("TLS authentication failed");
                            this.running = false;
                        }
                    }
                    if (this.running) {
                        console.warn(this.running);
                        //this.socketStream.ReadTimeout = 50;
                        //this.ProcessASDUs();
                        //this.callbackThread = new Thread(ProcessASDUs);
                        //this.callbackThread.Start();
                        this.ResetT3Timeout(Lib60870.prototype.GetUInt64Value(new Date().valueOf()));
                    }
                    while (this.running) {
                        console.warn('..');
                        try {
                            const bytesRec = this.receiveMessage(bytes);
                            if (bytesRec > 0) {
                                this.DebugLog("RCVD: " + BitConverter.ToString(bytes, 0, bytesRec));
                                if (this.HandleMessage(bytes, bytesRec) == false) {
                                    this.running = false;
                                }
                                if (this.unconfirmedReceivedIMessages >= this.apciParameters.W) {
                                    this.lastConfirmationTime = Lib60870.prototype.GetUInt64Value(new Date().valueOf());
                                    this.unconfirmedReceivedIMessages = 0;
                                    this.timeoutT2Triggered = false;
                                    this.SendSMessage();
                                }
                            } else if (bytesRec == -1) {
                                this.running = false;
                            }
                        } catch (e) {
                            this.running = false;
                        }
                        if (this.fileServer != null) {
                            this.fileServer.HandleFileTransmission();
                        }
                        if (this.handleTimeouts() == false) {
                            this.running = false;
                        }
                        console.warn(this.running, this.isActive);
                        if (this.running) {
                            if (this.isActive) {
                                this.SendWaitingASDUs();
                            }
                            Lib60870.prototype.Thread.Sleep(1);
                        }
                    }
                    this.isActive = false;
                    this.DebugLog("CLOSE CONNECTION!");
                    // Release the socket.
                    this.socket.Shutdown(SocketShutdown.Both);
                    this.socket.Close();
                    this.socketStream.Dispose();
                    this.socket.Dispose();
                    this.DebugLog("CONNECTION CLOSED!");
                } catch (ane) {
                    this.DebugLog("ArgumentNullException : " + ane);
                }
            } catch (se) {
                this.DebugLog("SocketException : " + se);
            }
            if (this.oldestSentASDU != -1) {
                this.asduQueue.UnmarkAllASDUs();
            }
            this.server.Remove(this);
            if (this.callbackThreadRunning) {
                this.callbackThreadRunning = false;
                this.callbackThread.Join();
            }
            this.DebugLog("Connection thread finished");*/
        }
        /*
        void HandleRemoteCertificateValidationCallback (object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors)
        {
        }


        public void Close()
        {
            running = false;
        }*/

        ASDUReadyToSend() {
            if (this.isActive) {
                this.SendWaitingASDUs()
            }
        }
    }
    Lib60870.prototype.ClientConnection = ClientConnection
}
