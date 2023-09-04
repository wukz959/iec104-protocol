import net from 'net'

declare const SocketShutdown: any
declare const EnqueueMode: any

export function server(Lib60870) {

    Lib60870.prototype.ASDUQueue = class {
        QueueEntryState = {
            NOT_USED : 1,
            WAITING_FOR_TRANSMISSION : 2,
            SENT_BUT_NOT_CONFIRMED : 3
        }

        ASDUQueueEntry = class {
            entryTimestamp
            asdu
            state
        }

        enqueuedASDUs: any = null
        oldestQueueEntry = -1
        latestQueueEntry = -1
        numberOfAsduInQueue = 0
        maxQueueSize
        enqueueMode
        parameters
        DebugLog: any = null

        constructor(maxQueueSize, enqueueMode,parameters, DebugLog) {
            this.enqueuedASDUs = []
            for (let i = 0; i < maxQueueSize; i++) {
                this.enqueuedASDUs[i] = new this.ASDUQueueEntry()
                this.enqueuedASDUs[i].asdu = new Lib60870.prototype.BufferFrame(new Uint8Array(260), 6)
                this.enqueuedASDUs[i].state = this.QueueEntryState.NOT_USED
            }

            this.enqueueMode = enqueueMode
            this.oldestQueueEntry = -1
            this.latestQueueEntry = -1
            this.numberOfAsduInQueue = 0
            this.maxQueueSize = maxQueueSize
            this.parameters = parameters
            this.DebugLog = DebugLog
        }

        EnqueueAsdu(asdu) {
            //console.warn(asdu);
            //lock (this.enqueuedASDUs) {
                if (this.oldestQueueEntry == -1) {
                    this.oldestQueueEntry = 0
                    this.latestQueueEntry = 0
                    this.numberOfAsduInQueue = 1
                    this.enqueuedASDUs[0].asdu.ResetFrame()
                    asdu.Encode(this.enqueuedASDUs[0].asdu, this.parameters)

                    this.enqueuedASDUs[0].entryTimestamp = new Date().valueOf()
                    this.enqueuedASDUs[0].state = this.QueueEntryState.WAITING_FOR_TRANSMISSION
                } else {
                    let enqueue = true
                    if (this.numberOfAsduInQueue == this.maxQueueSize) {
                        if (this.enqueueMode == Lib60870.prototype.EnqueueMode.REMOVE_OLDEST) {
                        } else if (this.enqueueMode == EnqueueMode.IGNORE) {
                            this.DebugLog('Queue is full. Ignore new ASDU.')
                            enqueue = false
                        } else if (this.enqueueMode == Lib60870.prototype.EnqueueMode.THROW_EXCEPTION) {
                            throw new Lib60870.prototype.ASDUQueueException('Event queue is full.')
                        }
                    }
                    if (enqueue) {
                        this.latestQueueEntry = (this.latestQueueEntry + 1) % this.maxQueueSize
                        if (this.latestQueueEntry == this.oldestQueueEntry) {
                            this.oldestQueueEntry = (this.oldestQueueEntry + 1) % this.maxQueueSize
                        } else {
                            this.numberOfAsduInQueue++
                        }
                        this.enqueuedASDUs[this.latestQueueEntry].asdu.ResetFrame()
                        asdu.Encode(this.enqueuedASDUs[this.latestQueueEntry].asdu, this.parameters)
                        this.enqueuedASDUs[this.latestQueueEntry].entryTimestamp = new Date().valueOf()
                        this.enqueuedASDUs[this.latestQueueEntry].state = this.QueueEntryState.WAITING_FOR_TRANSMISSION
                    }
                }
            //}
            this.DebugLog('Queue contains ' + this.numberOfAsduInQueue + ' messages (oldest: ' + this.oldestQueueEntry + ' latest: ' + this.latestQueueEntry + ')')
        }

        LockASDUQueue() {
            //this.Monitor.Enter(this.enqueuedASDUs);
        }

        UnlockASDUQueue() {
            //this.Monitor.Exit(this.enqueuedASDUs);
        }

        GetNextWaitingASDU(timestamp, index) {
            const result = {
                timestamp: 0,
                index: -1,
                asdu: null
            }
            if (this.enqueuedASDUs == null) {
                return result
            }
            if (this.numberOfAsduInQueue > 0) {
                let currentIndex = this.oldestQueueEntry
                while (this.enqueuedASDUs[currentIndex].state != this.QueueEntryState.WAITING_FOR_TRANSMISSION) {
                    if (this.enqueuedASDUs[currentIndex].state == this.QueueEntryState.NOT_USED) {
                        break
                    }
                    currentIndex = (currentIndex + 1) % this.maxQueueSize
                    // break if we reached the oldest entry again
                    if (currentIndex == this.oldestQueueEntry) {
                        break
                    }
                }
                if (this.enqueuedASDUs[currentIndex].state == this.QueueEntryState.WAITING_FOR_TRANSMISSION) {
                    this.enqueuedASDUs[currentIndex].state = this.QueueEntryState.SENT_BUT_NOT_CONFIRMED
                    result.timestamp = this.enqueuedASDUs[currentIndex].entryTimestamp
                    result.index = currentIndex
                    result.asdu = this.enqueuedASDUs[currentIndex].asdu
                    return result
                }
                return result
            }
            return result
        }

        UnmarkAllASDUs() {
            //lock (enqueuedASDUs) {
                if (this.numberOfAsduInQueue > 0) {
                    for (let i = 0; i < this.enqueuedASDUs.Length; i++) {
                        if (this.enqueuedASDUs[i].state == this.QueueEntryState.SENT_BUT_NOT_CONFIRMED) {
                            this.enqueuedASDUs[i].state = this.QueueEntryState.WAITING_FOR_TRANSMISSION
                        }
                    }
                }
            //}
        }

        MarkASDUAsConfirmed(index, timestamp) {
            if (this.enqueuedASDUs == null) {
                return
            }
            if ((index < 0) || (index > this.enqueuedASDUs.Length)) {
                return
            }
            //lock (this.enqueuedASDUs) {
                if (this.numberOfAsduInQueue > 0) {
                    if (this.enqueuedASDUs[index].state == this.QueueEntryState.SENT_BUT_NOT_CONFIRMED) {
                        if (this.enqueuedASDUs[index].entryTimestamp == timestamp) {
                            let currentIndex = index
                            while (this.enqueuedASDUs[currentIndex].state == this.QueueEntryState.SENT_BUT_NOT_CONFIRMED) {
                                this.DebugLog('Remove from queue with index ' + currentIndex)
                                this.enqueuedASDUs[currentIndex].state = this.QueueEntryState.NOT_USED
                                this.enqueuedASDUs[currentIndex].entryTimestamp = 0
                                this.numberOfAsduInQueue -= 1
                                if (this.numberOfAsduInQueue == 0) {
                                    this.oldestQueueEntry = -1
                                    this.latestQueueEntry = -1
                                    break
                                }
                                if (currentIndex == this.oldestQueueEntry) {
                                    this.oldestQueueEntry = (index + 1) % this.maxQueueSize
                                    if (this.numberOfAsduInQueue == 1) {
                                        this.latestQueueEntry = this.oldestQueueEntry
                                    }
                                    break
                                }
                                currentIndex = currentIndex - 1
                                if (currentIndex < 0) {
                                    currentIndex = this.maxQueueSize - 1
                                }
                                // break if we reached the first deleted entry again
                                if (currentIndex == index) {
                                    break
                                }
                            }
                            this.DebugLog('queue state: noASDUs: ' + this.numberOfAsduInQueue + ' oldest: ' + this.oldestQueueEntry + ' latest: ' + this.latestQueueEntry)
                        }
                    }
                }
            //}
        }
    }

    Lib60870.prototype.RedundancyGroup = class {
        asduQueue: any = null
        server: any = null
        name = ''
        AllowedClients: any = null
        connections = []

        constructor(name) {
            this.name = name
        }

        get Name() {
            return this.name
        }

        get IsCatchAll() {
            if (this.AllowedClients == null) {
                return true
            } else {
                return false
            }
        }

        AddAllowedClient(ipAddress) {
            if (this.AllowedClients == null) {
                this.AllowedClients = []
            }
            this.AllowedClients.Add(ipAddress)
        }

        // AddAllowedClient(ipString) {
        //     const ipAddress = Lib60870.prototype.IPAddress.Parse(ipString)
        //     this.AddAllowedClient(ipAddress)
        // }

        AddConnection(connection) {
            (this.connections as any).push(connection)
        }

        RemoveConnection(connection) {
            this.connections = this.connections.filter((_connection) => (_connection as any).connectionID !== connection.connectionID)
        }

        Matches(ipAddress) {
            let matches = false
            if (this.AllowedClients != null) {
                this.AllowedClients.forEach(function(allowedClient, index) {
                    if (this.allowedClient.Equals(ipAddress) && !matches) {
                        matches = true
                        //break;
                    }
                })
            }
            return matches
        }

        HasConnection(con) {
            this.connections.forEach(function(connection, index) {
                if (connection == con) {
                    return true
                }
            })
            return false
        }

        Activate(activeConnection) {
            if (this.HasConnection(activeConnection)) {
                const $this = this
                this.connections.forEach(function(connection: any, index) {
                    if (connection != activeConnection) {
                        if (connection.IsActive) {
                            $this.server.CallConnectionEventHandler(connection, Lib60870.prototype.ClientConnectionEvent.INACTIVE)
                            connection.IsActive = false
                        }
                    }
                })
            }
        }

        EnqueueASDU(asdu) {
            if (this.asduQueue != null) {
                this.asduQueue.EnqueueAsdu(asdu)
            }
        }
    }

    class Server extends Lib60870.prototype.Slave {
        localHostname = '0.0.0.0'
        localPort = 2404
        running = false
        listeningSocket: any = null
        maxQueueSize = 1000
        maxOpenConnections = 10
        fileTimeout = null
        receiveTimeoutInMs = 1000 /* maximum allowed time between SOF byte and last message byte */
        redGroups: any = []
        serverMode = Lib60870.prototype.ServerMode.SINGLE_REDUNDANCY_GROUP
        get ServerMode() {
            return this.serverMode
        }
        set ServerMode(value) {
            this.serverMode = value
        }
        enqueueMode = Lib60870.prototype.EnqueueMode.REMOVE_OLDEST

        get EnqueueMode() {
            return this.enqueueMode
        }
        set EnqueueMode(value) {
            this.enqueueMode = value
        }

        DebugLog(msg) {
            if (this.debugOutput) {
                console.log('CS104 SLAVE: ' + msg)
            }
        }

        get MaxQueueSize() {
            return this.maxQueueSize
        }

        set MaxQueueSize(value) {
            this.maxQueueSize = value
        }

        get MaxOpenConnections() {
            return this.maxOpenConnections
        }

        set MaxOpenConnections(value) {
            this.maxOpenConnections = value
        }

        apciParameters
        alParameters

        GetApplicationLayerParameters() {
            return this.alParameters
        }

        GetAPCIParameters() {
            return this.apciParameters
        }

        securityInfo = null
        allOpenConnections = []

        constructor(parameter1, parameter2, parameter3) {
            super()
            if (typeof parameter2 == 'undefined') {
                this.apciParameters = new Lib60870.prototype.APCIParameters()
                this.alParameters = new Lib60870.prototype.ApplicationLayerParameters()
                if (typeof parameter1 != 'undefined') {
                    const securityInfo = parameter1
                    this.securityInfo = securityInfo
                    if (this.securityInfo != null) {
                        this.localPort = 19998
                    }
                }
            } else {
                const apciParameters = parameter1
                const alParameters = parameter2
                this.apciParameters = apciParameters
                this.alParameters = alParameters
                if (typeof parameter3 != 'undefined') {
                    const securityInfo = parameter3
                    this.securityInfo = securityInfo
                    if (this.securityInfo != null) {
                        this.localPort = 19998
                    }
                }
            }
        }

        AddRedundancyGroup(redundancyGroup) {
            this.redGroups.push(redundancyGroup)
        }

        connectionRequestHandler: any = null
        connectionRequestHandlerParameter: any = null

        SetConnectionRequestHandler(handler, parameter) {
            this.connectionRequestHandler = handler
            this.connectionRequestHandlerParameter = parameter
        }

        connectionEventHandler: any = null
        connectionEventHandlerParameter = null

        SetConnectionEventHandler(handler, parameter) {
            this.connectionEventHandler = handler
            this.connectionEventHandlerParameter = parameter
        }
        get OpenConnections() {
            return this.allOpenConnections.length
        }

        get ReceiveTimeout() {
            return this.receiveTimeoutInMs
        }
        set ReceiveTimeout(value) {
            this.receiveTimeoutInMs = value
        }

        checkConnectionTimer: any = null

        ServerAcceptThread() {
            this.running = true
            this.DebugLog('Waiting for connections...')
            const $this = this
            this.checkConnectionTimer = setTimeout(function () {
                $this.CheckClientConnection()
            }, 100)
        }

        CheckClientConnection() {
            //clearTimeout(this.checkConnectionTimer);
            try {
                const newSocket: any = this.listeningSocket //listen(this.localPort);
                if (newSocket != null) {
                    newSocket.setNoDelay(true)
                    this.DebugLog('New connection')
                    const ipEndPoint = new Lib60870.prototype.IPEndPoint(newSocket.remoteAddress)
                    this.DebugLog('  from IP: ' + ipEndPoint.Address)
                    let acceptConnection = true
                    if (this.OpenConnections >= this.maxOpenConnections) {
                        acceptConnection = false
                    }
                    if (acceptConnection && (this.connectionRequestHandler != null)) {
                        acceptConnection = this.connectionRequestHandler(this.connectionRequestHandlerParameter, ipEndPoint.Address)
                    }
                    if (acceptConnection) {
                        let connection = null
                        if ((this.serverMode == Lib60870.prototype.ServerMode.SINGLE_REDUNDANCY_GROUP) || (this.serverMode == Lib60870.prototype.ServerMode.MULTIPLE_REDUNDANCY_GROUPS)) {
                            let catchAllGroup: any = null
                            let matchingGroup: any = null
                            this.redGroups.forEach(function(redGroup, index) {
                                if (redGroup == ipEndPoint.Address && matchingGroup == null) {
                                    matchingGroup = redGroup
                                }
                                if (redGroup.IsCatchAll) {
                                    catchAllGroup = redGroup
                                }
                            })
                            if (matchingGroup == null) {
                                matchingGroup = catchAllGroup
                            }
                            if (matchingGroup != null) {
                                connection = new Lib60870.prototype.ClientConnection(newSocket, this.securityInfo, this.apciParameters, this.alParameters, this, matchingGroup.asduQueue, this.debugOutput)
                                this.DebugLog(this.serverMode)
                                this.DebugLog(matchingGroup.IsCatchAll)
                                matchingGroup.AddConnection(connection)
                                this.DebugLog('Add connection to group: ' + matchingGroup.Name)
                            } else {
                                this.DebugLog('Found no matching redundancy group -> close connection')
                                newSocket.Close()
                            }
                        } else {
                            connection = new Lib60870.prototype.ClientConnection(newSocket, this.securityInfo, this.apciParameters, this.alParameters, this, new Lib60870.prototype.ASDUQueue(this.maxQueueSize, this.enqueueMode, this.alParameters, this.DebugLog), this.debugOutput)
                        }
                        if (connection != null) {
                            this.allOpenConnections.push(connection)
                            this.DebugLog('allOpenConnections ' + this.allOpenConnections.length)
                            this.CallConnectionEventHandler(connection, Lib60870.prototype.ClientConnectionEvent.OPENED)
                        }
                    } else {
                        newSocket.Close()
                    }
                }
            } catch (e) {
                this.DebugLog('Exception: ' + e)
                this.running = false
            }
            /*var $this = this;
            this.listeningSocket = null;
            this.checkConnectionTimer = setTimeout(function () {
                $this.CheckClientConnection();
            }, 100);*/
        }

        Remove(connection) {
            this.CallConnectionEventHandler(connection, Lib60870.prototype.ClientConnectionEvent.CLOSED)
            if ((this.serverMode == Lib60870.prototype.ServerMode.MULTIPLE_REDUNDANCY_GROUPS) || (this.serverMode == Lib60870.prototype.ServerMode.SINGLE_REDUNDANCY_GROUP)) {
                const $this = this
                this.redGroups.forEach(function(redGroup, index) {
                    $this.redGroups[index].RemoveConnection(connection)
                })
            }
            //this.allOpenConnections.Remove(connection);
            this.allOpenConnections = this.allOpenConnections.filter((_connection: any) => _connection.connectionID !== connection.connectionID)
        }

        SetLocalAddress(localAddress) {
            this.localHostname = localAddress
        }

        SetLocalPort(tcpPort) {
            this.localPort = tcpPort
        }

        Start() {
            const ipAddress = Lib60870.prototype.IPAddress.Parse(this.localHostname)
            const localEP = new Lib60870.prototype.IPEndPoint(ipAddress, this.localPort)
            const server = net.createServer(socket => {
                //$this.listeningSocket = socket;
                /*socket.on('connect', data => {
                    console.warn('Data', data);
                    console.warn(this);
                });*/
            })
            server.listen(this.localPort)
            //this.DebugLog("Waiting for connections...");
            server.on('connection', function(socket) {
                $this.listeningSocket = socket
                $this.CheckClientConnection()
            })
            /*this.listeningSocket = net.createServer(socket => {
                socket.on('data', function(data, data2) {
                    console.warn('Data', data);
                });
            });
            this.listeningSocket.listen(this.localPort, ipAddress, function(data) {
                console.warn('Listen', data);
            });*/
            //this.listeningSocket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            //this.listeningSocket.Bind(localEP);
            //this.listeningSocket.Listen(100);
            //server.listen(this.localPort);
            //var acceptThread = new Thread(ServerAcceptThread);
            if (this.serverMode == Lib60870.prototype.ServerMode.SINGLE_REDUNDANCY_GROUP) {
                if (this.redGroups.length > 0) {
                    const singleGroup = this.redGroups[0]
                    this.redGroups.Clear()
                    this.redGroups.Add(singleGroup)
                } else {
                    const singleGroup = new Lib60870.prototype.RedundancyGroup()
                    this.redGroups.push(singleGroup)
                }
            }
            const $this = this
            if (this.serverMode == Lib60870.prototype.ServerMode.SINGLE_REDUNDANCY_GROUP || this.serverMode == Lib60870.prototype.ServerMode.MULTIPLE_REDUNDANCY_GROUPS) {
                this.redGroups.forEach(function(redGroup, index) {
                    redGroup.asduQueue = new Lib60870.prototype.ASDUQueue($this.maxQueueSize, $this.enqueueMode, $this.alParameters, $this.DebugLog)
                    redGroup.server = $this
                })
            }
            //acceptThread.Start();
            const acceptThread = this.ServerAcceptThread()
        }

        Stop() {
            this.running = false
            try {
                try {
                    this.listeningSocket.Shutdown(SocketShutdown.Both)
                } catch (ex) {
                    this.DebugLog('SocketException: ' + ex.Message)
                }
                this.listeningSocket.Close()
                this.allOpenConnections.forEach(function(connection, index) {
                    (connection as any).Close()
                })
            } catch (e) {
                this.DebugLog('Exception: ' + e.Message)
            }
        }

        EnqueueASDU(asdu) {
            if (this.serverMode == Lib60870.prototype.ServerMode.CONNECTION_IS_REDUNDANCY_GROUP) {
                this.allOpenConnections.forEach(function(connection, index) {
                    if ((connection as any).IsActive) {
                        (connection as any).GetASDUQueue().EnqueueAsdu(asdu)
                    }
                })
            } else {
                this.redGroups.forEach(function(redGroup,index) {
                    redGroup.EnqueueASDU(asdu)
                })
            }
        }

        CallConnectionEventHandler(connection, e) {
            this.DebugLog('ConnectionEventHandler:' + (this.connectionEventHandler != null))
            this.DebugLog('ConnectionEventHandlerParameter:' + (this.connectionEventHandlerParameter != null))
            if (this.connectionEventHandler != null) {
                this.connectionEventHandler(this.connectionEventHandlerParameter, connection, e)
            }
        }

        Activated(activeConnection) {
            this.CallConnectionEventHandler(activeConnection, Lib60870.prototype.ClientConnectionEvent.ACTIVE)
            if ((this.serverMode == Lib60870.prototype.ServerMode.SINGLE_REDUNDANCY_GROUP) || (this.serverMode == Lib60870.prototype.ServerMode.MULTIPLE_REDUNDANCY_GROUPS)) {
                this.redGroups.forEach(function(redGroup, index) {
                    redGroup.Activate(activeConnection)
                })
            }
        }

        Deactivated(activeConnection) {
            this.CallConnectionEventHandler(activeConnection, Lib60870.prototype.ClientConnectionEvent.INACTIVE)
        }

        get FileTimeout() {
            if (this.fileTimeout != null) {
                return this.FileTimeout
            } else {
                return -1
            }
        }

        set FileTimeout(value) {
            this.fileTimeout = value
        }
    }
    Lib60870.prototype.Server = Server
}
