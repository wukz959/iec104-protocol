declare class ASDUParsingException {
    constructor(a?: any)
}
declare const ushort: any

export function systemInformationCommands(Lib60870) {
    class QualifierOfInterrogation {
        STATION = 20
        GROUP_1 = 21
        GROUP_2 = 22
        GROUP_3 = 23
        GROUP_4 = 24
        GROUP_5 = 25
        GROUP_6 = 26
        GROUP_7 = 27
        GROUP_8 = 28
        GROUP_9 = 29
        GROUP_10 = 30
        GROUP_11 = 31
        GROUP_12 = 32
        GROUP_13 = 33
        GROUP_14 = 34
        GROUP_15 = 35
        GROUP_16 = 36
    }

    class InterrogationCommand extends Lib60870.prototype.InformationObject {
        GetEncodedSize() {
            return 1
        }

        get Type() {
            return Lib60870.prototype.TypeID.C_IC_NA_1
        }

        get SupportsSequence() {
            return false
        }

        qoi

        get QOI() {
            return this.qoi
        }

        set QOI(value) {
            this.qoi = value
        }

        constructor(parameter1, parameter2, parameter3) {
            if (typeof parameter1 == 'number') {
                const ioa = parameter1
                const qoi = parameter2
                super(ioa)
                this.qoi = qoi
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                super(parameters, msg, startIndex, false)
                startIndex += parameters.SizeOfIOA /* skip IOA */
                if ((msg.Length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small')
                }
                this.qoi = msg[startIndex++]
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.SetNextByte(this.qoi)
        }
    }

    class CounterInterrogationCommand extends Lib60870.prototype.InformationObject {
        GetEncodedSize() {
            return 1
        }

        get Type () {
            return Lib60870.prototype.TypeID.C_CI_NA_1
        }

        get SupportsSequence() {
            return false
        }

        qcc

        /// <summary>
        /// Gets or sets the QCC (Qualifier of counter interrogation).
        /// </summary>
        /// <value>The QCC</value>
        get QCC() {
            return this.qcc
        }
        set QCC(value) {
            this.qcc = value
        }

        constructor(parameter1, parameter2, parameter3) {
            if (typeof parameter1 == 'number') {
                const ioa = parameter1
                const qoi = parameter2
                super(ioa)
                this.qcc = qoi
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                super(parameters, msg, startIndex, false)
                startIndex += parameters.SizeOfIOA /* skip IOA */
                if ((msg.Length - startIndex) < this.GetEncodedSize()) {
                    throw new Lib60870.prototype.ASDUParsingException('Message too small')
                }
                this.qcc = msg[startIndex++]
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.SetNextByte(this.qcc)
        }
    }

    class ReadCommand extends Lib60870.prototype.InformationObject {
        GetEncodedSize() {
            return 0
        }

        get Type() {
            return Lib60870.prototype.TypeID.C_RD_NA_1
        }

        get SupportsSequence() {
            return false
        }

        constructor(parameter1, parameter2, parameter3) {
            if (typeof parameter1 == 'number') {
                const ioa = parameter1
                super(ioa)
            } else {
                const parameters = parameter1
                const msg = parameter2
                const startIndex = parameter3
                super(parameters, msg, startIndex, false)
            }
        }
    }

    class TestCommandWithCP56Time2a extends Lib60870.prototype.InformationObject {
        time
        tsc

        /// <summary>
        /// Test time
        /// </summary>
        get Time() {
            return this.time
        }

        set Time(value) {
            this.time = value
        }

        /// <summary>
        /// Test sequence number
        /// </summary>
        get TSC() {
            return this.tsc
        }

        set TSC(value) {
            this.tsc = value
        }

        GetEncodedSize() {
            return 9
        }

        get Type() {
            return Lib60870.prototype.TypeID.C_TS_TA_1
        }

        get SupportsSequence() {
            return false
        }

        constructor(parameter1, parameter2, parameter3) {
            if (typeof parameter1 == 'undefined') {
                super(0)
                this.time = new Lib60870.prototype.CP56Time2a()
            } else if (typeof parameter1 == 'number') {
                const tsc = parameter1
                const time = parameter2
                super(0)
                this.time = time
                this.tsc = tsc
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                super(parameters, msg, startIndex, false)
                startIndex += parameters.SizeOfIOA /* skip IOA */

                if ((msg.Length - startIndex) < this.GetEncodedSize())
                    throw new ASDUParsingException('Message too small')

                this.tsc = msg[startIndex++]
                this.tsc += (ushort)(msg[startIndex++] * 256)

                this.time = new Lib60870.prototype.CP56Time2a(msg, startIndex)
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.SetNextByte(Lib60870.prototype.GetByteValue((this.tsc % 256)))
            frame.SetNextByte(Lib60870.prototype.GetByteValue((this.tsc / 256)))
            frame.AppendBytes(this.time.GetEncodedValue())
        }
    }

    class TestCommand extends Lib60870.prototype.InformationObject {
        GetEncodedSize() {
            return 2
        }

        get Type() {
            return Lib60870.prototype.TypeID.C_TS_NA_1
        }

        valid = true

        get Valid() {
            return this.valid
        }

        get SupportsSequence() {
            return false
        }

        constructor(parameter1, parameter2, parameter3) {
            if (typeof parameter1 == 'undefined') {
                super(0)
            } else {
                const parameters = parameter1
                const msg = parameter2
                let startIndex = parameter3
                super(parameters, msg, startIndex, false)
                startIndex += parameters.SizeOfIOA /* skip IOA */

                if ((msg.Length - startIndex) < this.GetEncodedSize()) {
                    throw new ASDUParsingException('Message too small')
                }
                if (msg[startIndex++] != 0xaa) {
                    this.valid = false
                }
                if (msg[startIndex] != 0x55) {
                    this.valid = false
                }
            }
        }

        Encode(frame, parameters, isSequence) {
            super.Encode(frame, parameters, isSequence)
            frame.SetNextByte(0xaa)
            frame.SetNextByte(0x55)
        }
    }
    /*
    public class ClockSynchronizationCommand : InformationObject
    {
        override public int GetEncodedSize()
        {
            return 7;
        }

        override public TypeID Type
        {
            get
            {
                return TypeID.C_CS_NA_1;
            }
        }

        override public bool SupportsSequence
        {
            get
            {
                return false;
            }
        }

        private CP56Time2a newTime;

        public CP56Time2a NewTime
        {
            get
            {
                return this.newTime;
            }
            set
            {
                newTime = value;
            }
        }

        public ClockSynchronizationCommand(int ioa, CP56Time2a newTime)
    : base(ioa)
        {
            this.newTime = newTime;
        }

        internal ClockSynchronizationCommand(ApplicationLayerParameters parameters, byte[] msg, int startIndex)
    : base(parameters, msg, startIndex, false)
        {
            startIndex += parameters.SizeOfIOA;

            if ((msg.Length - startIndex) < GetEncodedSize())
                throw new ASDUParsingException("Message too small");

            newTime = new CP56Time2a(msg, startIndex);
        }

        public override void Encode(Frame frame, ApplicationLayerParameters parameters, bool isSequence)
        {
            base.Encode(frame, parameters, isSequence);

            frame.AppendBytes(newTime.GetEncodedValue());
        }
    }

    public class ResetProcessCommand : InformationObject
    {
        override public int GetEncodedSize()
        {
            return 1;
        }

        override public TypeID Type
        {
            get
            {
                return TypeID.C_RP_NA_1;
            }
        }

        override public bool SupportsSequence
        {
            get
            {
                return false;
            }
        }

        byte qrp;

        /// <summary>
        /// Gets or sets the QRP (Qualifier of reset process command).
        /// </summary>
        /// <value>The QRP</value>
        public byte QRP
        {
            get
            {
                return this.qrp;
            }
            set
            {
                qrp = value;
            }
        }

        public ResetProcessCommand(int ioa, byte qrp)
    : base(ioa)
        {
            this.qrp = qrp;
        }

        internal ResetProcessCommand(ApplicationLayerParameters parameters, byte[] msg, int startIndex)
    : base(parameters, msg, startIndex, false)
        {
            startIndex += parameters.SizeOfIOA;

            if ((msg.Length - startIndex) < GetEncodedSize())
                throw new ASDUParsingException("Message too small");

            qrp = msg[startIndex++];
        }

        public override void Encode(Frame frame, ApplicationLayerParameters parameters, bool isSequence)
        {
            base.Encode(frame, parameters, isSequence);

            frame.SetNextByte(qrp);
        }

    }

    public class DelayAcquisitionCommand : InformationObject
    {
        override public int GetEncodedSize()
        {
            return 2;
        }

        override public TypeID Type
        {
            get
            {
                return TypeID.C_CD_NA_1;
            }
        }

        override public bool SupportsSequence
        {
            get
            {
                return false;
            }
        }

        private CP16Time2a delay;

        public CP16Time2a Delay
        {
            get
            {
                return this.delay;
            }
            set
            {
                delay = value;
            }
        }

        public DelayAcquisitionCommand(int ioa, CP16Time2a delay)
    : base(ioa)
        {
            this.delay = delay;
        }

        internal DelayAcquisitionCommand(ApplicationLayerParameters parameters, byte[] msg, int startIndex)
    : base(parameters, msg, startIndex, false)
        {
            startIndex += parameters.SizeOfIOA;

            if ((msg.Length - startIndex) < GetEncodedSize())
                throw new ASDUParsingException("Message too small");

            delay = new CP16Time2a(msg, startIndex);
        }

        public override void Encode(Frame frame, ApplicationLayerParameters parameters, bool isSequence)
        {
            base.Encode(frame, parameters, isSequence);

            frame.AppendBytes(delay.GetEncodedValue());
        }
    }
    */
    Lib60870.prototype.QualifierOfInterrogation = QualifierOfInterrogation
    Lib60870.prototype.InterrogationCommand = InterrogationCommand
    Lib60870.prototype.CounterInterrogationCommand = CounterInterrogationCommand
    Lib60870.prototype.ReadCommand = ReadCommand
    Lib60870.prototype.TestCommandWithCP56Time2a = TestCommandWithCP56Time2a
    Lib60870.prototype.TestCommand = TestCommand
}
