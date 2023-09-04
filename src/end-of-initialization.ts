export function endOfInitialization(Lib60870) {
    class EndOfInitialization extends Lib60870.prototype.InformationObject {
        coi

        get COI() {
            return this.coi
        }

        set COI(value) {
            this.coi = value
        }

        GetEncodedSize() {
            return 1
        }

        get Type() {
            return Lib60870.prototype.TypeID.M_EI_NA_1
        }

        get SupportsSequence() {
            return false
        }

        constructor(parameter1, parameter2, parameter3) {
            if (typeof parameter2 == 'undefined') {
                const coi = parameter1
                super(0)
                this.coi = coi
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                super(parameters, msg, startIndex, false)
                startIndex += parameters.SizeOfIOA
                if ((msg.length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for EndOfInitization')
                }
                this.coi = msg[startIndex]
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.SetNextByte(this.coi)
        }
    }
    Lib60870.prototype.EndOfInitialization = EndOfInitialization
}
