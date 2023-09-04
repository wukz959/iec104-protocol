export function setpointCommand(Lib60870) {
    class SetpointCommandShort extends Lib60870.prototype.InformationObject {
        GetEncodedSize() {
            return 5
        }

        get Type() {
            return Lib60870.prototype.TypeID.C_SE_NC_1
        }

        get SupportsSequence() {
            return false
        }

        value

        get Value() {
            return this.value
        }

        qos

        get QOS() {
            return this.qos
        }

        constructor(parameter1, parameter2, parameter3) {
            if (typeof parameter1 == 'number') {
                const objectAddress = parameter1
                const value = parameter2
                const qos = parameter3
                super(objectAddress)
                this.value = value
                this.qos = qos
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                super(parameters, msg, startIndex, false)
                startIndex += parameters.SizeOfIOA
                if ((msg.length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for SetpointCommandShort')
                }
                this.value = Lib60870.prototype.ToSingle(msg, startIndex)
                startIndex += 4
                this.qos = new Lib60870.prototype.SetpointCommandQualifier(msg[startIndex++])
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.AppendBytes(Lib60870.prototype.GetBytes(this.value))
            frame.SetNextByte(this.qos.GetEncodedValue())
        }
    }

    class SetpointCommandShortWithCP56Time2a extends SetpointCommandShort {
        GetEncodedSize() {
            return 12
        }

        get Type() {
            return Lib60870.prototype.TypeID.C_SE_TC_1
        }

        get SupportsSequence() {
            return false
        }

        timestamp

        get Timestamp() {
            return this.timestamp
        }

        constructor(parameter1, parameter2, parameter3, parameter4) {
            if (typeof parameter4 != 'undefined') {
                const objectAddress = parameter1
                const value = parameter2
                const qos = parameter3
                const timestamp = parameter4
                super(objectAddress, value, qos)
                this.timestamp = timestamp
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                super(parameters, msg, startIndex)
                startIndex += parameters.SizeOfIOA
                if ((msg.length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for SetpointCommand')
                }
                startIndex += 5 /* skip IOA + float + QOS*/
                this.timestamp = new Lib60870.prototype.CP56Time2a(msg, startIndex)
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.AppendBytes(this.timestamp.GetEncodedValue())
        }
    }
    Lib60870.prototype.SetpointCommandShort = SetpointCommandShort
    Lib60870.prototype.SetpointCommandShortWithCP56Time2a = SetpointCommandShortWithCP56Time2a
}
