export function testCommand(Lib60870) {
    class TestCommand extends Lib60870.prototype.InformationObject {
        valid = true

        constructor() {
            super(0)
        }

        GetEncodedSize() {
            return 2
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.SetNextByte(0xaa)
            frame.SetNextByte(0x55)
        }
    }
    Lib60870.prototype.TestCommand = TestCommand
}
