export function applicationLayerParameters(Lib60870) {
    Lib60870.prototype.ApplicationLayerParameters = class {
        IEC60870_5_104_MAX_ASDU_LENGTH = 249
        originatorAddress = 0
        sizeOfTypeId = 1
        sizeOfVSQ = 1
        sizeOfCOT = 2
        sizeOfCA = 2
        sizeOfIOA = 3
        maxAsduLength = this.IEC60870_5_104_MAX_ASDU_LENGTH

        constructor() {}

        Clone() {
            const copy = new Lib60870.prototype.ApplicationLayerParameters()
            copy.sizeOfTypeId = this.sizeOfTypeId
            copy.sizeOfVSQ = this.sizeOfVSQ
            copy.sizeOfCOT = this.sizeOfCOT
            copy.originatorAddress = this.originatorAddress
            copy.sizeOfCA = this.sizeOfCA
            copy.sizeOfIOA = this.sizeOfIOA
            copy.maxAsduLength = this.maxAsduLength
            return copy
        }

        get SizeOfCOT() {
            return this.sizeOfCOT
        }

        set SizeOfCOT(value) {
            this.sizeOfCOT = value
        }

        get OA() {
            return this.originatorAddress
        }

        set OA(value) {
            this.originatorAddress = value
        }

        get SizeOfCA() {
            return this.sizeOfCA
        }

        set SizeOfCA(value) {
            this.sizeOfCA = value
        }

        get SizeOfIOA() {
            return this.sizeOfIOA
        }

        set SizeOfIOA(value) {
            this.sizeOfIOA = value
        }

        get SizeOfTypeId() {
            return this.sizeOfTypeId
        }

        get SizeOfVSQ() {
            return this.sizeOfVSQ
        }

        get MaxAsduLength() {
            return this.maxAsduLength
        }

        set MaxAsduLength(value) {
            this.maxAsduLength = value
        }
    }
}
