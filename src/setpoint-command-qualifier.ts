export function setpointCommandQualifier(Lib60870) {
    Lib60870.prototype.SetpointCommandQualifier = class {
        encodedValue

        constructor(parameter1, parameter2) {
            if (typeof parameter2 == 'undefined') {
                const encodedValue = parameter1
                this.encodedValue = encodedValue
            } else {
                const select = parameter1
                const ql = parameter2
                this.encodedValue = Lib60870.prototype.GetByteValue((ql & 0x7f))
                if (select) {
                    this.encodedValue |= 0x80
                }
            }
        }

        get QL() {
            return (this.encodedValue & 0x7f)
        }

        get Select() {
            return ((this.encodedValue & 0x80) == 0x80)
        }

        GetEncodedValue() {
            return this.encodedValue
        }
    }
}
