export function utils(Lib60870) {
    Lib60870.prototype.string = class {
        constructor() {
        }

        static Format() {
            const length = arguments.length
            let text = arguments[0]
            for (let i = 1; i < length; i++) {
                text = text.replace('{' + (i - 1) + '}', arguments[i])
            }
            return text
        }
    }

    Lib60870.prototype.NetworkStream = class {
        socket: any = null
        constructor(socket) {
            this.socket = socket
        }

        Read(buffer, bufPos, msgSize) {
            return 1
        }

        Write(buffer, bufPos, msgSize) {
            this.socket.write(buffer.slice(bufPos, (bufPos + msgSize)))
        }
    }

    Lib60870.prototype.Thread = class {
        sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
        constructor() {

        }

        static Sleep(seconds) {
            const ms = seconds * 1000
            const unixtime_ms = new Date().getTime()
            while(new Date().getTime() < unixtime_ms + ms) {}
        }
    }

    Lib60870.prototype.IPAddress = class {
        constructor() {
        }

        static Parse(hostname) {
            return hostname
        }
    }

    Lib60870.prototype.IPEndPoint = class {
        address = null
        port = null

        get Address() {
            return this.address
        }
        
        set Address(value) {
            this.address = value
        }

        get Port() {
            return this.port
        }

        set Port(value) {
            this.port = value
        }

        constructor(ipAddress, port) {
            ipAddress = ipAddress || '0.0.0.0'
            port = port || '2404'
            this.Address = ipAddress
            this.Port = port
        }
    }

    Lib60870.prototype.ToSingle = function (msg, startIndex) { //System.Bitconverter.ToSingle UInt8Array to float
        const view = new DataView(new ArrayBuffer(4))
        const bytes = msg.slice(startIndex, (startIndex + 4))
        const length = bytes.length
        for (let i = 0; i < length; i++) {
            view.setUint8(i, bytes[i])
        }
        const value = view.getFloat32(0, Lib60870.prototype.IsLittleEndian)
        return Math.round(value * 100) / 100
    }

    Lib60870.prototype.IsLittleEndian = true

    Lib60870.prototype.GetBytes = function (value) { //System.Bitconverter.GetBytes UInt8Array from float
        const floatArray = new Float32Array(1)
        floatArray[0] = value
        const msg = new Uint8Array(floatArray.buffer)
        return msg
    }

    Lib60870.prototype.GetSingleValueFromBit = function (msg, startIndex) { //System.Bitconverter.GetSingle float from UInt8Array
        const bytes = msg.slice(startIndex, (startIndex + 4))
        const value = (Lib60870.prototype.GetLongValue((bytes[0])) << 24) + (Lib60870.prototype.GetLongValue((bytes[1])) << 16) + (Lib60870.prototype.GetLongValue((bytes[2])) << 8) + (Lib60870.prototype.GetLongValue((bytes[3])))
        return value
    }

    Lib60870.prototype.GetByteValue = function (value) {
        return value
    }

    Lib60870.prototype.GetUInt64Value = function (value) {
        return value
    }

    Lib60870.prototype.GetUInt16Value = function (value) {
        return value
    }

    Lib60870.prototype.GetLongValue = function (value) {
        return value
    }

    Lib60870.prototype.GetShortValue = function (value) {
        return value
    }
}
