import net from 'net'

export function connection(Lib60870) {
    Lib60870.prototype.Connection = class {
        socket: any = null
        running: any = false
        connecting: any = false
        useSendMessageQueue: any = false
        useKeepAlive: any = false
        useReconnect: any = false
        maxSentASDUs: any = 12
        oldestSentASDU: any = -1
        newestSentASDU: any = -1
        sentASDUs: any = []
        sendSequenceNumber: any = 0
        receiveSequenceNumber
        lastException
        connectionCounter = 0
        connectionID
        statistics = new Lib60870.prototype.ConnectionStatistics()
        unconfirmedReceivedIMessages
        timeoutT2Triggered = false
        sentMessageHandler: any = null
        sentMessageHandlerParameter = null
        debugOutput = true
        debugBuffer = false
        asduReceivedHandler = null
        asduReceivedHandlerParameter = null
        connectionHandler = null
        connectionHandlerParameter = null
        STARTDT_ACT_MSG = new Uint8Array(6)
        STARTDT_CON_MSG = new Uint8Array(6)
        STOPDT_ACT_MSG = new Uint8Array(6)
        STOPDT_CON_MSG = new Uint8Array(6)
        TESTFR_ACT_MSG = new Uint8Array(6)
        TESTFR_CON_MSG = new Uint8Array(6)
        keepAliveTimer: any = null
        reconnectTimer: any = null
        reconnectT1 = 10000
        reconnectT2 = 60000
        reconnectTLimit = 10
        reconnectTCounter = 0
        quiet = false



        constructor(hostname, tcpPort) {
            this.STARTDT_ACT_MSG[0] = 0x68
            this.STARTDT_ACT_MSG[1] = 0x04
            this.STARTDT_ACT_MSG[2] = 0x07

            this.STARTDT_CON_MSG[0] = 0x68
            this.STARTDT_CON_MSG[1] = 0x04
            this.STARTDT_CON_MSG[2] = 0x0b

            this.STOPDT_ACT_MSG[0] = 0x68
            this.STOPDT_ACT_MSG[1] = 0x04
            this.STOPDT_ACT_MSG[2] = 0x13

            this.STOPDT_CON_MSG[0] = 0x68
            this.STOPDT_CON_MSG[1] = 0x04
            this.STOPDT_CON_MSG[2] = 0x23

            this.TESTFR_ACT_MSG[0] = 0x68
            this.TESTFR_ACT_MSG[1] = 0x04
            this.TESTFR_ACT_MSG[2] = 0x43

            this.TESTFR_CON_MSG[0] = 0x68
            this.TESTFR_CON_MSG[1] = 0x04
            this.TESTFR_CON_MSG[2] = 0x83

            this.Setup(hostname, tcpPort)
        }

        get UseSendMessageQueue() {
            return this.useSendMessageQueue
        }

        set UseSendMessageQueue(value) {
            this.useSendMessageQueue = value
        }

        get SendSequenceNumber() {
            return this.sendSequenceNumber
        }
        set SendSequenceNumber(value) {
            this.sendSequenceNumber = value
        }

        Setup(hostname, tcpPort) {
            (this as any).hostname = hostname;
            (this as any).alParameters = new Lib60870.prototype.ApplicationLayerParameters();
            (this as any).apciParameters = new Lib60870.prototype.APCIParameters();
            (this as any).tcpPort = tcpPort;
            (this as any).connectTimeoutInMs = (this as any).apciParameters.T0 * 1000

            this.connectionCounter++
            this.connectionID = this.connectionCounter
        }

        Connect() {
            this.connecting = true
            const $this = this
            return new Promise(function (resolve, reject) {
                const socket = new net.Socket({ readable: true, writable: true, allowHalfOpen: false })
                socket.connect(($this as any).tcpPort, ($this as any).hostname)
                socket.on('error', function (data) {
                    if (!Lib60870.prototype?.quiet) {
                        console.error(data.toString())
                    }
                    resolve(false)
                })

                socket.on('data', function (data) {
                    if (!Lib60870.prototype?.quiet) {
                        console.log('data from: ' + ($this as any).hostname)
                    }
                    $this.checkMessage(data, data.length)
                })

                socket.on('timeout', function (data) {
                    if (!Lib60870.prototype?.quiet) {
                        console.log('Timeout: ',($this as any).hostname, ' ', data.toString())
                    }
                    $this.running = false;
                    ($this as any).socketError = true
                    socket.end()
                })

                socket.on('ready', function () {
                    $this.running = true
                    $this.reconnectTCounter = 0;
                    ($this as any).socketError = false
                    $this.connecting = false
                    socket.setKeepAlive(true)
                    $this.SendSMessage()
                    resolve(true)
                })

                socket.on('close', function (data) {
                    socket.end()
                    $this.running = false
                    $this.Reconnect()
                })

                socket.on('end', function () {
                    if (!Lib60870.prototype?.quiet) {
                        console.warn('Disconnected from server')
                    }
                })

                $this.socket = socket
            })
        }

        KeepAlive() {
            clearTimeout(this.keepAliveTimer)
            if (this.useKeepAlive) {
                const $this = this
                this.keepAliveTimer = setTimeout(function () {
                    if ($this.running) {
                        $this.SendTestCommand(1)
                    }
                    $this.KeepAlive()
                }, 5000)
            }
        }

        Reconnect() {
            clearTimeout(this.reconnectTimer)
            if (this.useReconnect) {
                const $this = this
                $this.reconnectTCounter++
                const reconnectTimeout = ($this.reconnectTCounter > $this.reconnectTLimit) ? $this.reconnectT2 : $this.reconnectT1
                this.reconnectTimer = setTimeout(function () {
                    if (!$this.running) {
                        if (!Lib60870.prototype?.quiet) {
                            console.warn($this.reconnectTCounter, reconnectTimeout)
                        }
                        $this.ResetConnection()
                        //$this.oldestSentASDU = -1;
                        //$this.newestSentASDU = -1;
                        //$this.statistics.SentMsgCounter = 0;
                        //$this.ResetT3Timeout(Lib60870.prototype.GetUInt64Value(new Date().valueOf()));
                        $this.Connect()
                    }
                }, reconnectTimeout)
            }
        }

        SetReconnect(useReconnect) {
            this.useReconnect = useReconnect | 0
        }

        SetKeepAlive(useKeepAlive) {
            this.useKeepAlive = useKeepAlive | 0
            this.KeepAlive()
        }

        checkMessage(buffer, msgSize) {
            const currentTime = new Date().valueOf()
            if ((buffer[2] & 1) == 0) {
                if (this.timeoutT2Triggered == false) {
                    (this as any).timeoutT2Triggered = true;
                    (this as any).lastConfirmationTime = currentTime
                }
                if (msgSize < 7) {
                    this.DebugLog('I msg too small!')
                    return false
                }
                const frameSendSequenceNumber = ((buffer[3] * 0x100) + (buffer[2] & 0xfe)) / 2
                const frameRecvSequenceNumber = ((buffer[5] * 0x100) + (buffer[4] & 0xfe)) / 2
                this.DebugLog('Received I frame: N(S) = ' + frameSendSequenceNumber + ' N(R) = ' + frameRecvSequenceNumber)
                if (typeof this.receiveSequenceNumber == 'undefined') {
                    this.receiveSequenceNumber = 1
                }
                if (frameSendSequenceNumber != this.receiveSequenceNumber) {
                    // this.DebugLog("Sequence error: Close connection!|" + frameSendSequenceNumber + "|" + this.receiveSequenceNumber);
                    // return false;
                }
                if (this.CheckSequenceNumber(frameRecvSequenceNumber) == false) {
                    return false
                }
                this.receiveSequenceNumber = (this.receiveSequenceNumber + 1) % 32768
                this.unconfirmedReceivedIMessages++
                try {
                    const asdu = new Lib60870.prototype.ASDU((this as any).alParameters, buffer, 6, msgSize)
                    let messageHandled = false
                    if ((this as any).fileClient != null) {
                        messageHandled = (this as any).fileClient.HandleFileAsdu(asdu)
                    }
                    if (messageHandled == false) {
                        if (this.asduReceivedHandler != null) {
                            (this as any).asduReceivedHandler(this.asduReceivedHandlerParameter, asdu)
                        }
                    }
                } catch (error) {
                    this.DebugLog('ASDU parsing failed: ' + error)
                    return false
                }
            } else if ((buffer[2] & 0x03) == 0x01) {
                const seqNo = (buffer[4] + buffer[5] * 0x100) / 2
                this.DebugLog('Recv S(' + seqNo + ') (own sendcounter = ' + this.sendSequenceNumber + ')')
                if (this.CheckSequenceNumber(seqNo) == false) {
                    return false
                }
            } else if ((buffer[2] & 0x03) == 0x03) {
                (this as any).uMessageTimeout = 0
                if (buffer[2] == 0x43) { // Check for TESTFR_ACT message
                    this.statistics.RcvdTestFrActCounter++
                    this.DebugLog('RCVD TESTFR_ACT')
                    this.DebugLog('SEND TESTFR_CON')
                    this.socket.write(this.TESTFR_CON_MSG)
                    this.statistics.SentMsgCounter++
                    if (this.sentMessageHandler != null) {
                        this.sentMessageHandler(this.sentMessageHandlerParameter, this.TESTFR_CON_MSG, 6)
                    }
                } else if (buffer[2] == 0x83) {
                    this.DebugLog('RCVD TESTFR_CON')
                    this.statistics.RcvdTestFrConCounter++
                    (this as any).outStandingTestFRConMessages = 0
                } else if (buffer[2] == 0x07) {
                    this.DebugLog('RCVD STARTDT_ACT')
                    this.socket.write(this.STARTDT_CON_MSG)
                    this.statistics.SentMsgCounter++
                    if (this.sentMessageHandler != null) {
                        this.sentMessageHandler(this.sentMessageHandlerParameter, this.STARTDT_CON_MSG, 6)
                    }
                } else if (buffer[2] == 0x0b) {
                    this.DebugLog('RCVD STARTDT_CON')
                    if (this.connectionHandler != null) {
                        (this as any).connectionHandler(this.connectionHandlerParameter, Lib60870.prototype.ConnectionEvent.STARTDT_CON_RECEIVED)
                    }
                } else if (buffer[2] == 0x23) {
                    this.DebugLog('RCVD STOPDT_CON')
                    if (this.connectionHandler != null) {
                        (this as any).connectionHandler(this.connectionHandlerParameter, Lib60870.prototype.ConnectionEvent.STOPDT_CON_RECEIVED)
                    }
                }
            } else {
                this.DebugLog('Unknown message type')
                return false
            }
            this.ResetT3Timeout()
            return true
        }

        CheckSequenceNumber(seqNo) {
            if ((this as any).checkSequenceNumbers) {
                //lock (this.sentASDUs) {
                let seqNoIsValid = false
                let counterOverflowDetected = false
                let oldestValidSeqNo = -1
                if (this.oldestSentASDU == -1) {
                    if (seqNo == this.sendSequenceNumber) {
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
            }
            return true
        }

        ResetT3Timeout() {
            (this as any).nextT3Timeout = Lib60870.prototype.GetUInt64Value(new Date().valueOf()) + Lib60870.prototype.GetUInt64Value(((this as any).apciParameters.T3 * 1000))
        }

        Close() {
            (this as any).client.destroy()
        }

        IsSentBufferFull() {
            return false //todo not real function
        }

        SendTestCommand(ca) {
            const asdu = new Lib60870.prototype.ASDU((this as any).alParameters, Lib60870.prototype.CauseOfTransmission.ACTIVATION, false, false, Lib60870.prototype.GetByteValue((this as any).alParameters.OA), ca, false)
            asdu.AddInformationObject(new Lib60870.prototype.TestCommand())
            this.DebugLog('SendTestCommand')
            this.SendASDUInternal(asdu)

        }

        SendInterrogationCommand(cot, ca, qoi) { //Lib60870.prototype.CauseOfTransmission, int, byte
            const asdu = new Lib60870.prototype.ASDU((this as any).alParameters, cot, false, false, (this as any).alParameters.OA, ca, false)
            asdu.AddInformationObject(new Lib60870.prototype.InterrogationCommand(0, qoi))
            this.SendASDUInternal(asdu)
        }

        SendClockSyncCommand(ca, time) {
            const asdu = new Lib60870.prototype.ASDU((this as any).alParameters, Lib60870.prototype.CauseOfTransmission.ACTIVATION, false, false, Lib60870.prototype.GetByteValue((this as any).alParameters.OA), ca, false)
            asdu.AddInformationObject(new Lib60870.prototype.ClockSynchronizationCommand(0, time))
            this.DebugLog('SendClockSyncCommand')
            this.SendASDUInternal(asdu)
        }

        SendASDUInternal(asdu) {
            //console.log(this.running, this.useSendMessageQueue, this.IsSentBufferFull());
            //lock (socket) {
            if (this.running == false) {
                return
                //throw new Lib60870.prototype.ConnectionException("not connected", "SocketException"); //new SocketException(10057));
            }
            if (this.useSendMessageQueue) {
                //lock (waitingToBeSent) {
                //    waitingToBeSent.Enqueue(asdu);
                //}
                (this as any).SendNextWaitingASDU()
            } else {
                if (this.IsSentBufferFull()) {
                    throw new Lib60870.prototype.ConnectionException('Flow control congestion. Try again later.')
                }
                this.SendIMessageAndUpdateSentASDUs(asdu)
            }
            //}
        }

        SendControlCommand(cot, ca, sc) {
            const controlCommand = new Lib60870.prototype.ASDU((this as any).alParameters, cot, false, false, Lib60870.prototype.GetByteValue((this as any).alParameters.OA), ca, false)
            controlCommand.AddInformationObject(sc)
            this.DebugLog('SendControlCommand')
            this.SendASDUInternal(controlCommand)
        }

        SetASDUReceivedHandler(handler, parameter) {
            this.asduReceivedHandler = handler
            this.asduReceivedHandlerParameter = parameter
        }

        SetConnectionHandler(handler, parameter) {
            this.connectionHandler = handler
            this.connectionHandlerParameter = parameter
        }

        SendSMessage() {
            const msg = new Uint8Array(6)
            msg[0] = 0x68
            msg[1] = 0x04
            msg[2] = 0x07
            msg[3] = 0
            msg[4] = Lib60870.prototype.GetByteValue(((this.receiveSequenceNumber % 128) * 2))
            msg[5] = Lib60870.prototype.GetByteValue((this.receiveSequenceNumber / 128))
            this.socket.write(msg)
            this.statistics.SentMsgCounter++
            if (this.sentMessageHandler != null) {
                this.sentMessageHandler(this.sentMessageHandlerParameter, msg, 6)
            }
        }

        SendIMessage(asdu) {
            const frame = new Lib60870.prototype.BufferFrame(new Uint8Array(260), 6)
            asdu.Encode(frame, (this as any).alParameters)
            const buffer = frame.GetBuffer()
            const msgSize = frame.GetMsgSize()
            //console.warn(this.sendSequenceNumber, ((this.sendSequenceNumber % 128) * 2));
            buffer[0] = 0x68
            buffer[1] = Lib60870.prototype.GetByteValue((msgSize - 2))
            buffer[2] = Lib60870.prototype.GetByteValue(((this.sendSequenceNumber % 128) * 2))
            buffer[3] = Lib60870.prototype.GetByteValue((this.sendSequenceNumber / 128))
            buffer[4] = Lib60870.prototype.GetByteValue(((this.receiveSequenceNumber % 128) * 2))
            buffer[5] = Lib60870.prototype.GetByteValue((this.receiveSequenceNumber / 128))
            if (this.running) {
                (this as any).socket.write(buffer.slice(0, msgSize))
                this.sendSequenceNumber = (this.sendSequenceNumber + 1) % 32768
                this.statistics.SentMsgCounter++
                this.unconfirmedReceivedIMessages = 0
                this.timeoutT2Triggered = false
                if (this.sentMessageHandler != null) {
                    (this as any).sentMessageHandler(this.sentMessageHandlerParameter, buffer, msgSize)
                }
                return this.sendSequenceNumber
            } else {
                if (this.lastException != null) {
                    throw new Lib60870.prototype.ConnectionException(this.lastException.Message, this.lastException)
                } else {
                    throw new Lib60870.prototype.ConnectionException('not connected', 'SocketException') //new SocketException(10057));
                }
            }
        }

        SendIMessageAndUpdateSentASDUs(asdu) {
            //lock (this.sentASDUs) {
            let currentIndex = 0
            if (this.oldestSentASDU == -1) {
                this.oldestSentASDU = 0
                this.newestSentASDU = 0
            } else {
                currentIndex = (this.newestSentASDU + 1) % this.maxSentASDUs
            }
            this.sentASDUs[currentIndex] = {}
            this.sentASDUs[currentIndex].seqNo = this.SendIMessage(asdu)
            this.sentASDUs[currentIndex].sentTime = new Date().valueOf()
            this.newestSentASDU = currentIndex
            //console.warn(currentIndex, this.sentASDUs[currentIndex]);
            if (this.debugBuffer) {
                this.PrintSendBuffer()
            }
            //}
        }

        PrintSendBuffer() {
            if (this.oldestSentASDU != -1) {
                let currentIndex = this.oldestSentASDU
                let nextIndex = 0
                this.DebugLog('------k-buffer------')
                while (nextIndex != -1) {
                    this.DebugLog(currentIndex + ' : S ' + this.sentASDUs[currentIndex].seqNo + ' : time ' + this.sentASDUs[currentIndex].sentTime)
                    if (currentIndex == this.newestSentASDU) {
                        nextIndex = -1
                    }
                    currentIndex = (currentIndex + 1) % this.maxSentASDUs
                }
                this.DebugLog('--------------------')
            }
        }

        DebugLog(message) {
            // if (this.debugOutput) {
            if (!Lib60870.prototype?.quiet) {
                console.log('CS104 MASTER CONNECTION ' + this.connectionID + ': ' + message)
            }
        }

        ResetConnection() {
            this.sendSequenceNumber = 0
            this.receiveSequenceNumber = 0
            this.unconfirmedReceivedIMessages = 0;
            //this.lastConfirmationTime = System.Int64.MaxValue;
            (this as any).timeoutT2Triggered = false;
            (this as any).outStandingTestFRConMessages = 0;
            (this as any).uMessageTimeout = 0;
            (this as any).socketError = false
            this.lastException = null
            this.maxSentASDUs = (this as any).apciParameters.K
            this.oldestSentASDU = -1
            this.newestSentASDU = -1
            delete this.receiveSequenceNumber
            this.sentASDUs = [] //new Lib60870.prototype.SentASDU[Lib60870.prototype.maxSentASDUs];

            if (this.useSendMessageQueue) {
                //this.waitingToBeSent = new Lib60870.prototype.Queue<Lib60870.prototype.ASDU> ();
            }
            this.statistics.Reset()
        }

        SetSentRawMessageHandler(handler, parameter) {
            this.sentMessageHandler = handler
            this.sentMessageHandlerParameter = parameter
        }

        SetOutputMessageHandler(handler) {
            Lib60870.prototype.output_message_handler = handler
        }
    }
}
