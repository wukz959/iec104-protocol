export function interrogationCommand(Lib60870) {
    class InterrogationCommand extends Lib60870.prototype.InformationObject {
        GetEncodedSize() {
            return 1
        }

        get Type() {
            return Lib60870.prototype.TypeID.C_IC_NA_1
        }

        get SupportsSequence() {
            return false
        }

        qoi

        get QOI() {
            return this.qoi
        }

        set QOI(value) {
            this.qoi = value
        }

        constructor(parameter1, parameter2, parameter3) {
            if (typeof parameter3 == 'undefined') {
                const ioa = parameter1
                const qoi = parameter2
                super(ioa)
                this.qoi = qoi
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                super(parameters, msg, startIndex)
                startIndex += parameters.SizeOfIOA
                if ((msg.length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for InterrogationCommand')
                }
                this.qoi = msg[startIndex++]
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.SetNextByte(this.qoi)
        }
    }
    Lib60870.prototype.InterrogationCommand = InterrogationCommand
}
