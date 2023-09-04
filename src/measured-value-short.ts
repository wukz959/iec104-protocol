export function measuredValueShort(Lib60870) {
    class MeasuredValueShort extends Lib60870.prototype.InformationObject {
        GetEncodedSize() {
            return 5
        }

        get Type() {
            return Lib60870.prototype.TypeID.M_ME_NC_1
        }

        get SupportsSequence() {
            return true
        }

        value

        get Value() {
            return this.value
        }
        set Value(value) {
            this.value = value
        }

        quality

        get Quality() {
            return this.quality
        }

        constructor(parameter1, parameter2, parameter3, parameter4) {
            if (typeof parameter4 == 'undefined') {
                const objectAddress = parameter1
                const value = parameter2
                const quality = parameter3
                super(objectAddress)
                this.value = value
                this.quality = quality
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                const isSequence = parameter4
                super(parameters, msg, startIndex, isSequence)
                if (!isSequence) {
                    startIndex += parameters.SizeOfIOA
                }
                if ((msg.Length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for MeasuredValueShort')
                }
                this.value = Lib60870.prototype.ToSingle(msg, startIndex)
                startIndex += 4
                this.quality = new Lib60870.prototype.QualityDescriptor(msg[startIndex++])
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            const floatEncoded = Lib60870.prototype.GetBytes(this.value)
            if (Lib60870.prototype.IsLittleEndian == false) {
                (Array as any).Reverse(floatEncoded)
            }
            frame.AppendBytes(floatEncoded)
            frame.SetNextByte(this.quality.EncodedValue)
        }
    }

    class MeasuredValueShortWithCP24Time2a extends MeasuredValueShort {
        GetEncodedSize() {
            return 8
        }

        get Type() {
            return Lib60870.prototype.TypeID.M_ME_TC_1
        }

        get SupportsSequence() {
            return false
        }

        timestamp

        get Timestamp() {
            return this.timestamp
        }

        constructor(parameter1, parameter2, parameter3, parameter4) {
            if (typeof parameter1 == 'object') {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                const isSequence = parameter4
                super(parameters, msg, startIndex, isSequence)
                if (!isSequence) {
                    startIndex += parameters.SizeOfIOA
                }
                if ((msg.length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for MeasuredValueShortWithCP24Time2a')
                }
                startIndex += 5
                this.timestamp = new Lib60870.prototype.CP24Time2a(msg, startIndex)
            } else{
                const objectAddress = parameter1
                const value = parameter2
                const quality = parameter3
                const timestamp = parameter4
                super(objectAddress, value, quality, 0)
                this.timestamp = timestamp
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.AppendBytes(this.timestamp.GetEncodedValue())
        }
    }

    class MeasuredValueShortWithCP56Time2a extends MeasuredValueShort {
        GetEncodedSize() {
            return 12
        }

        get Type() {
            return Lib60870.prototype.TypeID.M_ME_TF_1
        }

        get SupportsSequence() {
            return false
        }

        timestamp

        get Timestamp() {
            return this.timestamp
        }

        constructor(parameter1, parameter2, parameter3, parameter4) {
            if (typeof parameter1 == 'object') {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                const isSequence = parameter4
                super(parameters, msg, startIndex, isSequence)
                if (!isSequence) {
                    startIndex += parameters.SizeOfIOA
                }
                if ((msg.length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for MeasuredValueShortWithCP56Time2a')
                }
                startIndex += 5
                this.timestamp = new Lib60870.prototype.CP56Time2a(msg, startIndex)
            } else{
                const objectAddress = parameter1
                const value = parameter2
                const quality = parameter3
                const timestamp = parameter4
                super(objectAddress, value, quality, 0)
                this.timestamp = timestamp
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.AppendBytes(this.timestamp.GetEncodedValue())
        }
    }
    Lib60870.prototype.MeasuredValueShort = MeasuredValueShort
    Lib60870.prototype.MeasuredValueShortWithCP24Time2a = MeasuredValueShortWithCP24Time2a
    Lib60870.prototype.MeasuredValueShortWithCP56Time2a = MeasuredValueShortWithCP56Time2a
}
