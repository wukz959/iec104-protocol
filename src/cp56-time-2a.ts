declare class DateTime {
    constructor(a?: any, b?: any, c?: any, f?: any, g?: any, h?: any, i?: any)
}

export function cp56Time2a(Lib60870) {
    Lib60870.prototype.CP56Time2a = class {
        encodedValue = new Uint8Array(7)

        constructor(parameter1, parameter2) {
            for (let i = 0; i < 7; i++) {
                this.encodedValue[i] = 0
            }
            if (typeof parameter2 != 'undefined') {
                const msg = parameter1
                const startIndex = parameter2
                if (msg.length < startIndex + 7) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for parsing CP56Time2a')
                }
                for (let i = 0; i < 7; i++) {
                    this.encodedValue[i] = msg[startIndex + i]
                }
            } else {
                const time = parameter1
                this.Millisecond = time.getMilliseconds()
                this.Second = time.getSeconds()
                this.Year = time.getFullYear() % 100
                this.Month = (time.getMonth() + 1)
                this.DayOfMonth = time.getDate()
                this.Hour = time.getHours()
                this.Minute = time.getMinutes()
            }
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

        get Hour() {
            return (this.encodedValue[3] & 0x1f)
        }

        set Hour(value) {
            this.encodedValue[3] = Lib60870.prototype.GetByteValue(((this.encodedValue[3] & 0xe0) | (value & 0x1f)))
        }

        get DayOfWeek() {
            return ((this.encodedValue[4] & 0xe0) >> 5)
        }

        set DayOfWeek(value) {
            this.encodedValue[4] = Lib60870.prototype.GetByteValue(((this.encodedValue[4] & 0x1f) | ((value & 0x07) << 5)))
        }

        get DayOfMonth() {
            return (this.encodedValue[4] & 0x1f)
        }

        set DayOfMonth(value) {
            this.encodedValue[4] = Lib60870.prototype.GetByteValue(((this.encodedValue[4] & 0xe0) + (value & 0x1f)))
        }

        get Month() {
            return (this.encodedValue[5] & 0x0f)
        }

        set Month(value) {
            this.encodedValue[5] = Lib60870.prototype.GetByteValue(((this.encodedValue[5] & 0xf0) + (value & 0x0f)))
        }

        get Year() {
            return (this.encodedValue[6] & 0x7f)
        }

        set Year(value) {
            value = value % 100
            this.encodedValue[6] = Lib60870.prototype.GetByteValue(((this.encodedValue[6] & 0x80) + (value & 0x7f)))
        }

        get SummerTime() {
            return ((this.encodedValue[3] & 0x80) != 0)
        }

        set SummerTime(value) {
            if (value) {
                this.encodedValue[3] |= 0x80
            } else {
                this.encodedValue[3] &= 0x7f
            }
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

        GetDateTime(startYear) {
            if (typeof startYear == 'undefined') {
                return this.GetDateTime(1970)
            }
            let baseYear = (startYear / 100) * 100
            if (this.Year < (startYear % 100)) {
                baseYear += 100
            }
            let month = this.Month
            if (month == 0) {
                month = 1
            }
            let dayOfMonth = this.DayOfMonth
            if (dayOfMonth == 0) {
                dayOfMonth = 1
            }
            let value
            try {
                value = new DateTime(baseYear + this.Year, month, dayOfMonth, this.Hour, this.Minute, this.Second, this.Millisecond)
            } catch (ArgumentOutOfRangeException) {
                value = new DateTime()
            }
            return value
        }

        GetEncodedValue() {
            return this.encodedValue
        }

        ToString() {
            return Lib60870.prototype.string.Format('[CP56Time2a: Millisecond={0}, Second={1}, Minute={2}, Hour={3}, DayOfWeek={4}, DayOfMonth={5}, Month={6}, Year={7}, SummerTime={8}, Invalid={9} Substituted={10}]', this.Millisecond, this.Second, this.Minute, this.Hour, this.DayOfWeek, this.DayOfMonth, this.Month, this.Year, this.SummerTime, this.Invalid, this.Substituted)
        }
    }
}
