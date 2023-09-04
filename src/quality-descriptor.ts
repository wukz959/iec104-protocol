export function qualityDescriptor(Lib60870) {
    Lib60870.prototype.QualityDescriptor = class {
        encodedValue

        VALID() {
            return new Lib60870.prototype.QualityDescriptor()
        }

        INVALID() {
            const qd = new Lib60870.prototype.QualityDescriptor()
            qd.Invalid = true
            return qd
        }

        constructor(encodedValue) {
            this.encodedValue = encodedValue | 0
        }

        get Overflow() {
            return ((this.encodedValue & 0x01) != 0)
        }

        set Overflow(value) {
            if (value) {
                this.encodedValue |= 0x01
            } else {
                this.encodedValue &= 0xfe
            }
        }

        get Blocked() {
            return ((this.encodedValue & 0x10) != 0)
        }

        set Blocked(value) {
            if (value) {
                this.encodedValue |= 0x10
            } else {
                this.encodedValue &= 0xef
            }
        }

        get Substituted() {
            return ((this.encodedValue & 0x20) != 0)
        }

        set Substituted(value) {
            if (value) {
                this.encodedValue |= 0x20
            } else {
                this.encodedValue &= 0xdf
            }
        }

        get NonTopical() {
            return ((this.encodedValue & 0x40) != 0)
        }

        set NonTopical(value) {
            if (value) {
                this.encodedValue |= 0x40
            } else {
                this.encodedValue &= 0xbf
            }
        }

        get Invalid() {
            return ((this.encodedValue & 0x80) != 0)
        }

        set Invalid(value) {
            if (value) {
                this.encodedValue |= 0x80
            } else {
                this.encodedValue &= 0x7f
            }
        }
        get EncodedValue() {
            return this.encodedValue
        }

        set EncodedValue(value) {
            this.encodedValue = value
        }

        ToString() {
            return Lib60870.prototype.string.Format('[QualityDescriptor: Overflow={0}, Blocked={1}, Substituted={2}, NonTopical={3}, Invalid={4}]', this.Overflow, this.Blocked, this.Substituted, this.NonTopical, this.Invalid)
        }
    }
}
