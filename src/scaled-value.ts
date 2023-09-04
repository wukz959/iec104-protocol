export function scaledValue(Lib60870) {
    class ScaledValue {
        encodedValue = new Uint8Array(2)

        constructor(parameter1, parameter2) {
            if (typeof parameter2 != 'undefined') {
                const msg = parameter1
                const startIndex = parameter2
                if (msg.Length < startIndex + 2) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for parsing ScaledValue')
                }
                for (let i = 0; i < 2; i++) {
                    this.encodedValue[i] = msg[startIndex + i]
                }
            } else {
                const value = parameter1
                this.Value = this.ShortValue = value
            }
        }

        get Value() {
            let value = this.encodedValue[0]
            value += (this.encodedValue[1] * 0x100)
            if (value > 32767) {
                value = value - 65536
            }
            return value
        }

        set Value(value) {
            if (value > 32767) {
                value = 32767
            } else if (value < -32768) {
                value = -32768
            }
            const valueToEncode = Lib60870.prototype.GetShortValue(value)
            this.encodedValue[0] = Lib60870.prototype.GetByteValue((valueToEncode & 255))
            this.encodedValue[1] = Lib60870.prototype.GetByteValue((valueToEncode >> 8))
        }

        get ShortValue() {
            let uintVal = this.encodedValue[0]
            uintVal += Lib60870.prototype.GetUInt16Value((this.encodedValue[1] * 0x100))
            return Lib60870.prototype.GetShortValue(uintVal)
        }

        set ShortValue(value) {
            const uintVal = Lib60870.prototype.GetUInt16Value(value)
            this.encodedValue[0] = Lib60870.prototype.GetByteValue((uintVal % 256))
            this.encodedValue[1] = Lib60870.prototype.GetByteValue((uintVal / 256))
        }

        GetEncodedValue() {
            return this.encodedValue
        }

        ToString() {
            return '' + this.Value
        }
    }
    Lib60870.prototype.ScaledValue = ScaledValue
}
