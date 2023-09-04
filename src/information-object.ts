export function informationObject(Lib60870) {
    Lib60870.prototype.InformationObject = class {
        objectAddress

        constructor(parameter1, parameter2, parameter3, parameter4) {
            if (typeof parameter2 == 'undefined') {
                const objectAddress = parameter1
                this.objectAddress = objectAddress
            } else {
                const parameters = parameter1
                const msg = parameter2
                const startIndex = parameter3
                const isSequence = parameter4
                if (!isSequence) {
                    this.objectAddress = this.ParseInformationObjectAddress(parameters, msg, startIndex)
                }
            }
        }

        ParseInformationObjectAddress(parameters, msg, startIndex) {
            if (msg.length - startIndex < parameters.SizeOfIOA) {
                throw new Lib60870.prototype.ASDUParsingException('Message to short')
            }
            let ioa = msg[startIndex]
            if (parameters.SizeOfIOA > 1) {
                ioa += (msg[startIndex + 1] * 0x100)
            }
            if (parameters.SizeOfIOA > 2) {
                ioa += (msg[startIndex + 2] * 0x10000)
            }
            return ioa
        }

        get ObjectAddress() {
            return this.objectAddress
        }
        set ObjectAddress(value) {
            this.objectAddress = value
        }

        get SupportsSequence()  {
            return true
        }

        get Type() {
            return true
        }

        Encode(frame, parameters, isSequence) {
            if (!isSequence) {
                frame.SetNextByte(Lib60870.prototype.GetByteValue((this.objectAddress & 0xff)))
                if (parameters.SizeOfIOA > 1) {
                    frame.SetNextByte(Lib60870.prototype.GetByteValue(((this.objectAddress / 0x100) & 0xff)))
                }
                if (parameters.SizeOfIOA > 2) {
                    frame.SetNextByte(Lib60870.prototype.GetByteValue(((this.objectAddress / 0x10000) & 0xff)))
                }
            }
        }
    }
}
