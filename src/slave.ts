export function slave(Lib60870) {
    Lib60870.prototype.IMasterConnection = class {
        constructor() {
        }
        SendASDU(asdu) {}
        SendACT_CON(asdu, negative) {}
        SendACT_TERM(asdu) {}
        GetApplicationLayerParameters() {}
    }

    Lib60870.prototype.Slave = class {
        debugOutput

        constructor() {
        }

        get DebugOutput() {
            return this.debugOutput
        }

        set DebugOutput(value) {
            this.debugOutput = value
        }

        interrogationHandler = null
        InterrogationHandlerParameter = null

        counterInterrogationHandler = null
        counterInterrogationHandlerParameter = null

        readHandler = null
        readHandlerParameter = null

        clockSynchronizationHandler = null
        clockSynchronizationHandlerParameter = null

        resetProcessHandler = null
        resetProcessHandlerParameter = null

        delayAcquisitionHandler = null
        delayAcquisitionHandlerParameter = null

        asduHandler = null
        asduHandlerParameter = null

        fileReadyHandler = null
        fileReadyHandlerParameter = null

        SetInterrogationHandler(handler, parameter) {
            this.interrogationHandler = handler
            this.InterrogationHandlerParameter = parameter
        }

        SetCounterInterrogationHandler(handler, parameter) {
            this.counterInterrogationHandler = handler
            this.counterInterrogationHandlerParameter = parameter
        }

        SetReadHandler(handler, parameter) {
            this.readHandler = handler
            this.readHandlerParameter = parameter
        }

        SetClockSynchronizationHandler(handler, parameter) {
            this.clockSynchronizationHandler = handler
            this.clockSynchronizationHandlerParameter = parameter
        }

        SetResetProcessHandler(handler, parameter) {
            this.resetProcessHandler = handler
            this.resetProcessHandlerParameter = parameter
        }

        SetDelayAcquisitionHandler(handler, parameter) {
            this.delayAcquisitionHandler = handler
            this.delayAcquisitionHandlerParameter = parameter
        }

        SetASDUHandler(handler, parameter) {
            this.asduHandler = handler
            this.asduHandlerParameter = parameter
        }

        SetFileReadyHandler(handler, parameter) {
            this.fileReadyHandler = handler
            this.fileReadyHandlerParameter = parameter
        }

        filesAvailable = null //new FilesAvailable();

        GetAvailableFiles() {
            return this.filesAvailable
        }

        get FileTimeout() {
            return
        }

        set FileTimeout(value) {
            return
        }
    }
}
