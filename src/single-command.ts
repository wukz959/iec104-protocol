export function singleCommand(Lib60870) {
    class SingleCommand extends Lib60870.prototype.InformationObject {
        GetEncodedSize() {
            return 1
        }

        get Type() {
            return Lib60870.prototype.TypeID.C_SC_NA_1
        }

        get SupportsSequence() {
            return false
        }

        sco

         constructor(parameter1, parameter2, parameter3, parameter4) {
            if (typeof parameter1 == 'number') {
                const ioa = parameter1
                const command = parameter2
                const selectCommand = parameter3
                const qu = parameter4
                super(ioa)
                this.sco = Lib60870.prototype.GetByteValue(((qu & 0x1f) * 4))
                if (command) {
                    this.sco |= 0x01
                }
                if (selectCommand) {
                    this.sco |= 0x80
                }
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                super(parameters, msg, startIndex, false)
                startIndex += parameters.SizeOfIOA
                if ((msg.length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for SingleCommand')
                }
                this.sco = msg[startIndex++]
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.SetNextByte(this.sco)
        }

        get QU() {
            return ((this.sco & 0x7c) / 4)
        }

        set QU(value)  {
            this.sco = Lib60870.prototype.GetByteValue((this.sco & 0x81))
            this.sco += Lib60870.prototype.GetByteValue(((value & 0x1f) * 4))
        }

        get State() {
            return ((this.sco & 0x01) == 0x01)
        }

        set State(value) {
            if (value) {
                this.sco |= 0x01
            } else {
                this.sco &= 0xfe
            }
        }

        get Select() {
            return ((this.sco & 0x80) == 0x80)
        }

        set Select(value) {
            if (value) {
                this.sco |= 0x80
            } else {
                this.sco &= 0x7f
            }
        }

        ToString() {
            return Lib60870.prototype.string.Format('[SingleCommand: QU={0}, State={1}, Select={2}]', this.QU, this.State, this.Select)
        }
    }

    class SingleCommandWithCP56Time2a extends SingleCommand {
        get Type() {
            return Lib60870.prototype.TypeID.C_SC_TA_1
        }

        get SupportsSequence() {
            return false
        }

        timestamp

        get Timestamp() {
            return this.timestamp
        }

        constructor(parameter1, parameter2, parameter3, parameter4, parameter5) {
            if (typeof parameter4 != 'undefined') {
                const ioa = parameter1
                const command = parameter2
                const selectCommand = parameter3
                const qu = parameter4
                const timestamp = parameter5
                super(ioa, command, selectCommand, qu)
                this.timestamp = timestamp
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                super(parameters, msg, startIndex, 0)
                startIndex += parameters.SizeOfIOA
                if ((msg.length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for SingleCommandWithCP56Time2a')
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

    class DoubleCommand extends Lib60870.prototype.InformationObject {
        GetEncodedSize() {
            return 1
        }

        get Type() {
            return Lib60870.prototype.TypeID.C_DC_NA_1
        }

        get SupportsSequence() {
            return false
        }

        OFF = 1
        ON = 2
        dcq

        constructor(parameter1, parameter2, parameter3, parameter4) {
            if (typeof parameter1 == 'number') {
                const ioa = parameter1
                const command = parameter2
                const select = parameter3
                const quality = parameter4
                super(ioa)
                this.dcq = Lib60870.prototype.GetByteValue((command & 0x03))
                this.dcq += Lib60870.prototype.GetByteValue(((quality & 0x1f) * 4))
                if (select) {
                    this.dcq |= 0x80
                }
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                super(parameters, msg, startIndex, false)
                startIndex += parameters.SizeOfIOA
                if ((msg.length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for DoubleCommand')
                }
                this.dcq = msg[startIndex++]
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.SetNextByte(this.dcq)
        }

        get QU() {
            return ((this.dcq & 0x7c) / 4)
        }

        get State() {
            return (this.dcq & 0x03)
        }

        get Select() {
            return ((this.dcq & 0x80) == 0x80)
        }
    }

    class DoubleCommandWithCP56Time2a extends DoubleCommand {
        get Type() {
            return Lib60870.prototype.TypeID.C_DC_TA_1
        }

        get SupportsSequence() {
            return false
        }

        timestamp

        get Timestamp() {
            return this.timestamp
        }

        constructor(parameter1, parameter2, parameter3, parameter4, parameter5) {
            if (typeof parameter4 != 'undefined') {
                const ioa = parameter1
                const command = parameter2
                const select = parameter3
                const quality = parameter4
                const timestamp = parameter5
                super(ioa, command, select, quality)
                this.timestamp = timestamp
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                super(parameters, msg, startIndex, 0)
                startIndex += parameters.SizeOfIOA
                if ((msg.length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small for DoubleCommandWithCP56Time2a')
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

    Lib60870.prototype.SingleCommand = SingleCommand
    Lib60870.prototype.SingleCommandWithCP56Time2a = SingleCommandWithCP56Time2a
    Lib60870.prototype.DoubleCommand = DoubleCommand
    Lib60870.prototype.DoubleCommandWithCP56Time2a = DoubleCommandWithCP56Time2a
}
