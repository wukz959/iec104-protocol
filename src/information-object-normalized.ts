export function informationObjectNormalized(Lib60870) {
    Lib60870.prototype.InformationObjectNormalized = class {
        objectAddress
        value
        typeId
        type
        timestamp
        quality

        constructor(objectAddress, value, typeId, type, timestamp, quality) {
            this.objectAddress = objectAddress
            this.value = value
            this.typeId = typeId
            this.type = type
            this.timestamp = timestamp
            this.quality = quality
        }
    }
}
