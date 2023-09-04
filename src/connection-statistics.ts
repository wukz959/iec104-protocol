export function connectionStatistics(Lib60870) {
    Lib60870.prototype.ConnectionStatistics = class {
        sentMsgCounter = 0
        rcvdMsgCounter = 0
        rcvdTestFrActCounter = 0
        rcvdTestFrConCounter = 0
        Reset() {
            this.sentMsgCounter = 0
            this.rcvdMsgCounter = 0
            this.rcvdTestFrActCounter = 0
            this.rcvdTestFrConCounter = 0
        }
    }
}
