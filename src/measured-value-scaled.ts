export function measuredValueScaled(Lib60870) {
    class MeasuredValueScaled extends Lib60870.prototype.InformationObject {
        scaledValue
        quality

        constructor(parameter1, parameter2, parameter3, parameter4) {
            if (typeof parameter4 == 'undefined') {
                const objectAddress = parameter1
                const value = parameter2
                const quality = parameter3
                super(objectAddress)
                this.scaledValue = new Lib60870.prototype.ScaledValue(value)
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
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for MeasuredValueScaled')
                }
                this.scaledValue = new Lib60870.prototype.ScaledValue(msg, startIndex)
                startIndex += 2
                this.quality = new Lib60870.prototype.QualityDescriptor(msg[startIndex++])
            }
        }

        get Type() {
            return Lib60870.prototype.TypeID.M_ME_NB_1
        }

        get SupportsSequence() {
            return true
        }

        get ScaledValue() {
            return this.scaledValue
        }

        get Quality() {
            return this.quality
        }

        GetEncodedSize() {
            return 3
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.AppendBytes(this.scaledValue.GetEncodedValue())
            frame.SetNextByte(this.quality.EncodedValue)
        }
    }

    class MeasuredValueScaledWithCP56Time2a extends MeasuredValueScaled {
        timestamp

        GetEncodedSize() {
            return 10
        }

        get Type() {
            return Lib60870.prototype.TypeID.M_ME_TE_1
        }

        get SupportsSequence() {
            return false
        }

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
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for MeasuredValueScaled')
                }
                startIndex += 3
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
    Lib60870.prototype.MeasuredValueScaled = MeasuredValueScaled
    Lib60870.prototype.MeasuredValueScaledWithCP56Time2a = MeasuredValueScaledWithCP56Time2a
}
