export function cp24Time2a(Lib60870) {
    Lib60870.prototype.CP24Time2a = class {
        encodedValue = new Uint8Array(3)

        constructor(parameter1, parameter2, parameter3) {
            for (let i = 0; i < 3; i++) {
                this.encodedValue[i] = 0
            }
            if (typeof parameter3 == 'undefined') {
                const msg = parameter1
                const startIndex = parameter2
                if (msg.length < startIndex + 3) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for parsing CP24Time2a')
                }
                for (let i = 0; i < 3; i++) {
                    this.encodedValue[i] = msg[startIndex + i]
                }
            } else {
                const minute = parameter1
                const second = parameter2
                const millisecond = parameter3
                this.Millisecond = millisecond
                this.Second = second
                this.Minute = minute
            }
        }
        GetMilliseconds() {
            const millies = this.Minute * (60000) + this.Second * 1000 + this.Millisecond
            return millies
        }

        get Millisecond() {
            return (this.encodedValue[0] + (this.encodedValue[1] * 0x100)) % 1000
        }

        set Millisecond(value) {
            const millies = (this.Second * 1000) + value
            this.encodedValue[0] = Lib60870.prototype.GetByteValue((millies & 0xff))
            this.encodedValue[1] = Lib60870.prototype.GetByteValue(((millies / 0x100) & 0xff))
        }

        get Second() {
            return Math.floor((this.encodedValue[0] + (this.encodedValue[1] * 0x100)) / 1000)
        }

        set Second(value) {
            let millies = this.encodedValue[0] + (this.encodedValue[1] * 0x100)
            const msPart = millies % 1000
            millies = (value * 1000) + msPart
            this.encodedValue[0] = Lib60870.prototype.GetByteValue((millies & 0xff))
            this.encodedValue[1] = Lib60870.prototype.GetByteValue(((millies / 0x100) & 0xff))
        }

        get Minute() {
            return (this.encodedValue[2] & 0x3f)
        }

        set Minute(value) {
            this.encodedValue[2] = Lib60870.prototype.GetByteValue(((this.encodedValue[2] & 0xc0) | (value & 0x3f)))
        }

        get Invalid() {
            return ((this.encodedValue[2] & 0x80) != 0)
        }

        set Invalid(value) {
            if (value) {
                this.encodedValue[2] |= 0x80
            } else {
                this.encodedValue[2] &= 0x7f
            }
        }

        get Substituted() {
            return ((this.encodedValue[2] & 0x40) == 0x40)
        }

        set Substituted(value) {
            if (value) {
                this.encodedValue[2] |= 0x40
            } else {
                this.encodedValue[2] &= 0xbf
            }
        }

        GetEncodedValue() {
            return this.encodedValue
        }

        ToString() {
            return Lib60870.prototype.string.Format('[CP24Time2a: Millisecond={0}, Second={1}, Minute={2}, Invalid={3}, Substitued={4}]', this.Millisecond, this.Second, this.Minute, this.Invalid, this.Substituted)
        }
    }
}
