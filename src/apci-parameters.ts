export function apciParameters(Lib60870) {
    Lib60870.prototype.APCIParameters = class {
        k = 12
        w = 8
        t0 = 10
        t1 = 15
        t2 = 10
        t3 = 20

        Clone() {
            const copy = new Lib60870.prototype.APCIParameters()
            copy.k = this.k
            copy.w = this.w
            copy.t0 = this.t0
            copy.t1 = this.t1
            copy.t2 = this.t2
            copy.t3 = this.t3
            return copy
        }

        get K() {
            return this.k
        }

        set K(value) {
            this.k = value
        }

        get W() {
            return this.w
        }

        set W(value) {
            this.w = value
        }

        get T0() {
            return this.t0
        }

        set T0(value) {
            this.t0 = value
        }

        get T1() {
            return this.t1
        }

        set T1(value) {
            this.t1 = value
        }

        get T2() {
            return this.t2
        }

        set T2(value) {
            this.t2 = value
        }

        get T3() {
            return this.t3
        }

        set T3(value) {
            this.t3 = value
        }
    }
}
