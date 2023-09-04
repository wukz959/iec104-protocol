export function singlePointInformation(Lib60870) {
    class SinglePointInformation extends Lib60870.prototype.InformationObject {
        GetEncodedSize() {
            return 1
        }

        get Type() {
            return Lib60870.prototype.TypeID.M_SP_NA_1
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

        qos

        get QOS() {
            return this.qos
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
                if ((msg.length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for SinglePointInformation')
                }
                /* parse SIQ (single point information with qualitiy) */
                const siq = msg[startIndex++]
                this.value = ((siq & 0x01) == 0x01)
                this.quality = new Lib60870.prototype.QualityDescriptor(Lib60870.prototype.GetByteValue((siq & 0xf0)))
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            let val = this.quality.EncodedValue
            if (this.value) {
                val++
            }
            frame.SetNextByte(val)
        }
    }

    class SinglePointWithCP24Time2a extends SinglePointInformation {
        GetEncodedSize() {
            return 4
        }

        get Type() {
            return Lib60870.prototype.TypeID.M_SP_TA_1
        }

        get SupportsSequence() {
            return false
        }

        timestamp

        get Timestamp() {
            return this.timestamp
        }

        constructor(parameter1, parameter2, parameter3, parameter4) {
            if (typeof parameter1 == 'number') {
                const objectAddress = parameter1
                const value = parameter2
                const quality = parameter3
                const timestamp = parameter4
                super(objectAddress, value, quality, 0)
                this.timestamp = timestamp
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                const isSequence = parameter4
                super(parameters, msg, startIndex, isSequence)
                startIndex += parameters.SizeOfIOA
                if ((msg.length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for SinglePointWithCP24Time2a')
                }
                startIndex += 1
                this.timestamp = new Lib60870.prototype.CP24Time2a(msg, startIndex)
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.AppendBytes(this.timestamp.GetEncodedValue())
        }
    }

    class SinglePointWithCP56Time2a extends SinglePointInformation {
        GetEncodedSize() {
            return 8
        }

        get Type() {
            return Lib60870.prototype.TypeID.M_SP_TB_1
        }

        get SupportsSequence() {
            return false
        }

        timestamp

        get Timestamp() {
            return this.timestamp
        }

        constructor(parameter1, parameter2, parameter3, parameter4) {
            if (typeof parameter1 == 'number') {
                const objectAddress = parameter1
                const value = parameter2
                const quality = parameter3
                const timestamp = parameter4
                super(objectAddress, value, quality, 0)
                this.timestamp = timestamp
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                const isSequence = parameter4
                super(parameters, msg, startIndex, isSequence)
                startIndex += parameters.SizeOfIOA
                if ((msg.length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for SinglePointWithCP56Time2a')
                }
                startIndex += 1
                this.timestamp = new Lib60870.prototype.CP56Time2a(msg, startIndex)
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.AppendBytes(this.timestamp.GetEncodedValue())
        }
    }
    Lib60870.prototype.SinglePointInformation = SinglePointInformation
    Lib60870.prototype.SinglePointWithCP24Time2a = SinglePointWithCP24Time2a
    Lib60870.prototype.SinglePointWithCP56Time2a = SinglePointWithCP56Time2a
}
