export function exception(Lib60870) {
    Lib60870.prototype.ConnectionException = class {
        constructor(message) {
            throw new Error(message)
        }
    }
    Lib60870.prototype.ASDUParsingException = class {
        constructor(message) {
            throw new Error(message)
        }
    }
}
