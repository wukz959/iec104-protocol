declare const TypeID: any

export function measuredValueNormalized(Lib60870) {
    class MeasuredValueNormalizedWithoutQuality extends Lib60870.prototype.InformationObject {
        GetEncodedSize() {
            return 2
        }

        get Type() {
            return TypeID.M_ME_ND_1
        }

        get SupportsSequence() {
            return false
        }

        scaledValue

        get RawValue() {
            return this.scaledValue.ShortValue
        }
        set RawValue(value) {
            this.scaledValue.ShortValue = value
        }

        get NormalizedValue() {
            return parseFloat((this.scaledValue.Value + 0.5)) / parseFloat(32767.5 as any)
        }
        set NormalizedValue(value: any) {
            if (parseFloat(value) > 1) {
                value = 1
            } else if (parseFloat(value) < -1) {
                value = -1
            }
            this.scaledValue.Value = parseInt(((value * 32767.5) - 0.5) as any)
        }

        constructor(parameter1, parameter2, parameter3, parameter4) {
            if (typeof parameter3 == 'undefined') {
                const objectAddress = parameter1
                super(objectAddress)
                const isShort = false //todo check if parameter2 = float or short
                if (!isShort) {
                    const normalizedValue = parameter2
                    this.scaledValue = new Lib60870.prototype.ScaledValue()
                    this.NormalizedValue = normalizedValue
                } else {
                    const rawValue = parameter2
                    this.scaledValue = new Lib60870.prototype.ScaledValue(rawValue)
                }
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
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for MeasuredValueNormalized')
                }
                this.scaledValue = new Lib60870.prototype.ScaledValue(msg, startIndex)
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.AppendBytes(this.scaledValue.GetEncodedValue())
        }
    }

    class MeasuredValueNormalized extends MeasuredValueNormalizedWithoutQuality {
        GetEncodedSize() {
            return 3
        }

        get Type() {
            return Lib60870.prototype.TypeID.M_ME_NA_1
        }

        get SupportsSequence() {
            return true
        }

        quality

        get Quality() {
            return this.quality
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
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for MeasuredValueNormalized')
                }
                startIndex += 2
                this.quality = new Lib60870.prototype.QualityDescriptor(msg[startIndex++])
            } else{
                const objectAddress = parameter1
                const value = parameter2
                const quality = parameter3
                super(objectAddress, value, 0 , 0)
                this.quality = quality
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.SetNextByte(this.quality.EncodedValue)
        }
    }
    Lib60870.prototype.MeasuredValueNormalized = MeasuredValueNormalized
    Lib60870.prototype.MeasuredValueNormalizedWithoutQuality = MeasuredValueNormalizedWithoutQuality
}
