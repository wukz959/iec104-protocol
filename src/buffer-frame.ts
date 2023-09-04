declare const byte: any

export function bufferFrame(Lib60870) {
    Lib60870.prototype.BufferFrame = class {
        buffer
        startPos
        bufPos

        constructor(buffer, startPos) {
            this.buffer = buffer
            this.startPos = startPos
            this.bufPos = startPos
        }

        Clone() {
            const newBuffer = new byte[this.GetMsgSize()]
            let newBufPos = 0
            for (let i = this.startPos; i < this.bufPos; i++) {
                newBuffer[newBufPos++] = this.buffer[i]
            }
            const clone = new Lib60870.prototype.BufferFrame(newBuffer, 0)
            clone.bufPos = newBufPos
            return clone
        }

        ResetFrame() {
            this.bufPos = this.startPos
        }

        SetNextByte(value) {
            this.buffer[this.bufPos++] = value
        }

        AppendBytes(bytes) {
            for (let i = 0; i < bytes.length; i++) {
                this.buffer[this.bufPos++] = bytes[i]
            }
        }

        GetMsgSize() {
            return this.bufPos
        }

        GetBuffer() {
            return this.buffer
        }
    }
}
