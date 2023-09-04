export function clockSynchronizationCommand(Lib60870) {
    class ClockSynchronizationCommand extends Lib60870.prototype.InformationObject {
        GetEncodedSize() {
            return 7
        }

        get Type() {
            return Lib60870.prototype.TypeID.C_CS_NA_1
        }

        get SupportsSequence() {
            return false
        }

        get NewTime() {
            return this.newTime
        }

        set NewTime(value) {
            this.newTime = value
        }

        newTime

        constructor(parameter1, parameter2, parameter3) {
            if (typeof parameter3 == 'undefined') {
                const ioa = parameter1
                const newTime = parameter2
                super(ioa)
                this.newTime = newTime
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                super(parameters, msg, startIndex, false)
                startIndex += parameters.SizeOfIOA
                if ((msg.length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for ClockSynchronizationCommand')
                }
                this.newTime = new Lib60870.prototype.CP56Time2a(msg, startIndex)
            }
        }

        // GetEncodedSize() {
        //     return 1
        // }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.AppendBytes(this.newTime.GetEncodedValue())
        }
    }
    Lib60870.prototype.ClockSynchronizationCommand = ClockSynchronizationCommand
}
