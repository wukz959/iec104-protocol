declare const privateObjectTypes: any
export function asdu(Lib60870) {
    Lib60870.prototype.ASDU = class {
        parameters
        typeId
        cot
        isTest
        isNegative
        oa
        ca
        spaceLeft
        vsq
        isSequence
        hasTypeId
        payload: any = null
        informationObjects: any = []

        constructor(parameters, parameter2, parameter3, parameter4, parameter5, parameter6, parameter7) {
            if (typeof parameter2 !== 'object') {
                const cot = parameter2
                const isTest = parameter3
                const isNegative = parameter4
                const oa = parameter5
                const ca = parameter6
                const isSequence = parameter7
                this.internalASDU(parameters, Lib60870.prototype.TypeID.M_SP_NA_1, cot, isTest, isNegative, oa, ca, isSequence)
                this.hasTypeId = false
            } else {
                const msg = parameter2
                const bufPos = parameter3
                const msgLength = parameter4
                this.externalASDU(parameters, msg, bufPos, msgLength)
            }
        }

        get IsSequence() {
            return ((this.vsq & 0x80) != 0)
        }

        get NumberOfElements() {
            return (this.vsq & 0x7f)
        }

        get TypeId() {
            return this.typeId
        }

        get Cot() {
            return this.cot
        }

        set Cot(cot) {
            this.cot = cot
        }

        get Oa() {
            return this.oa
        }

        get IsTest() {
            return this.isTest
        }

        internalASDU(parameters, typeId, cot, isTest, isNegative, oa, ca, isSequence) {
            this.parameters = parameters
            this.typeId = typeId
            this.cot = cot
            this.isTest = isTest
            this.isNegative = isNegative
            this.isSequence = isSequence
            this.oa = oa
            this.ca = ca
            this.spaceLeft = parameters.MaxAsduLength - parameters.SizeOfTypeId - parameters.SizeOfVSQ - parameters.SizeOfCA - parameters.SizeOfCOT
            if (isSequence) {
                this.vsq = 0x80
            } else {
                this.vsq = 0
            }
            this.hasTypeId = true
        }

        GetElement(index) {
            if (index >= this.NumberOfElements) {
                throw new Lib60870.prototype.ASDUParsingException('Index out of range')
            }
            let retVal: any = null
            let elementSize
            switch (this.TypeId) {
                case Lib60870.prototype.TypeID.M_SP_NA_1: //1
                    elementSize = 1
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.SinglePointInformation(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.SinglePointInformation(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_SP_TA_1: // 2
                    elementSize = 4
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.SinglePointWithCP24Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.SinglePointWithCP24Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_DP_NA_1: // 3
                    elementSize = 1
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.DoublePointInformation(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.DoublePointInformation(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_DP_TA_1: //4
                    elementSize = 4
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.DoublePointWithCP24Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.DoublePointWithCP24Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_ST_NA_1: //5
                    elementSize = 2
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.StepPositionInformation(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.StepPositionInformation(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_ST_TA_1: //6
                    elementSize = 5
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.StepPositionWithCP24Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.StepPositionWithCP24Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_BO_NA_1: //7
                    elementSize = 5
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.Bitstring32(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.Bitstring32(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_BO_TA_1: //8
                    elementSize = 8
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.Bitstring32WithCP24Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.Bitstring32WithCP24Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_ME_NA_1: //9
                    elementSize = 3
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.MeasuredValueNormalized(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.MeasuredValueNormalized(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_ME_TA_1: //10
                    elementSize = 6
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.MeasuredValueNormalizedWithCP24Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.MeasuredValueNormalizedWithCP24Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_ME_NB_1: //11
                    elementSize = 3
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.MeasuredValueScaled(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.MeasuredValueScaled(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_ME_TB_1: //12
                    elementSize = 6
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.MeasuredValueScaledWithCP24Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.MeasuredValueScaledWithCP24Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_ME_NC_1: //13
                    elementSize = 5
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.MeasuredValueShort(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.MeasuredValueShort(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_ME_TC_1: //14
                    elementSize = 8
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.MeasuredValueShortWithCP24Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.MeasuredValueShortWithCP24Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_IT_NA_1: //15
                    elementSize = 5
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.IntegratedTotals(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.IntegratedTotals(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_IT_TA_1: //16
                    elementSize = 8
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.IntegratedTotalsWithCP24Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.IntegratedTotalsWithCP24Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_EP_TA_1: //17
                    elementSize = 3
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.EventOfProtectionEquipment(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.EventOfProtectionEquipment(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_EP_TB_1: //18
                    elementSize = 7
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.PackedStartEventsOfProtectionEquipment(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.PackedStartEventsOfProtectionEquipment(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_EP_TC_1: //19
                    elementSize = 7
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.PackedOutputCircuitInfo(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.PackedOutputCircuitInfo(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_PS_NA_1: //20
                    elementSize = 5
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.PackedSinglePointWithSCD(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.PackedSinglePointWithSCD(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_ME_ND_1: //21
                    elementSize = 2
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.MeasuredValueNormalizedWithoutQuality(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.MeasuredValueNormalizedWithoutQuality(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                    //22 - 29 reserved
                case Lib60870.prototype.TypeID.M_SP_TB_1: //30
                    elementSize = 8
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.SinglePointWithCP56Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.SinglePointWithCP56Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_DP_TB_1: //31
                    elementSize = 8
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.DoublePointWithCP56Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.DoublePointWithCP56Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_ST_TB_1: //32
                    elementSize = 9
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.StepPositionWithCP56Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.StepPositionWithCP56Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_BO_TB_1: //33
                    elementSize = 12
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.Bitstring32WithCP56Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.Bitstring32WithCP56Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_ME_TD_1: //34
                    elementSize = 10
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.MeasuredValueNormalizedWithCP56Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.MeasuredValueNormalizedWithCP56Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_ME_TE_1: //35
                    elementSize = 10
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.MeasuredValueScaledWithCP56Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.MeasuredValueScaledWithCP56Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_ME_TF_1: //36
                    elementSize = 12
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.MeasuredValueShortWithCP56Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.MeasuredValueShortWithCP56Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_IT_TB_1: //37
                    elementSize = 12
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.IntegratedTotalsWithCP56Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.IntegratedTotalsWithCP56Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_EP_TD_1: //38
                    elementSize = 10
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.EventOfProtectionEquipmentWithCP56Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.EventOfProtectionEquipmentWithCP56Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_EP_TE_1: //39
                    elementSize = 11
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.PackedStartEventsOfProtectionEquipmentWithCP56Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.PackedStartEventsOfProtectionEquipmentWithCP56Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                case Lib60870.prototype.TypeID.M_EP_TF_1: //40
                    elementSize = 11
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.PackedOutputCircuitInfoWithCP56Time2a(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.PackedOutputCircuitInfoWithCP56Time2a(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                    //41 - 44 reserved
                case Lib60870.prototype.TypeID.ASDU_TYPE_41: //41
                    elementSize = this.parameters.SizeOfIOA + 1
                    retVal = new Lib60870.prototype.Integer32Object(this.parameters, this.payload, index * elementSize, true)
                    break
                case Lib60870.prototype.TypeID.C_SC_NA_1: //45
                    elementSize = this.parameters.SizeOfIOA + 1
                    retVal = new Lib60870.prototype.SingleCommand(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_DC_NA_1: //46
                    elementSize = this.parameters.SizeOfIOA + 1
                    retVal = new Lib60870.prototype.DoubleCommand(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_RC_NA_1: //47
                    elementSize = this.parameters.SizeOfIOA + 1
                    retVal = new Lib60870.prototype.StepCommand(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_SE_NA_1: //48 - Set-point command, normalized value
                    elementSize = this.parameters.SizeOfIOA + 3
                    retVal = new Lib60870.prototype.SetpointCommandNormalized(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_SE_NB_1: //49 - Set-point command, scaled value
                    elementSize = this.parameters.SizeOfIOA + 3
                    retVal = new Lib60870.prototype.SetpointCommandScaled(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_SE_NC_1: //50 - Set-point command, short floating point number
                    elementSize = this.parameters.SizeOfIOA + 5
                    retVal = new Lib60870.prototype.SetpointCommandShort(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_BO_NA_1: //51 - Bitstring command
                    elementSize = this.parameters.SizeOfIOA + 4
                    retVal = new Lib60870.prototype.Bitstring32Command(this.parameters, this.payload, index * elementSize)
                    break
                    //52 - 57 reserved
                case Lib60870.prototype.TypeID.C_SC_TA_1: //58 - Single command with CP56Time2a
                    elementSize = this.parameters.SizeOfIOA + 8
                    retVal = new Lib60870.prototype.SingleCommandWithCP56Time2a(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_DC_TA_1: //59 - Double command with CP56Time2a
                    elementSize = this.parameters.SizeOfIOA + 8
                    retVal = new Lib60870.prototype.DoubleCommandWithCP56Time2a(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_RC_TA_1: //60 - Step command with CP56Time2a
                    elementSize = this.parameters.SizeOfIOA + 8
                    retVal = new Lib60870.prototype.StepCommandWithCP56Time2a(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_SE_TA_1: //61 - Setpoint command, normalized value with CP56Time2a
                    elementSize = this.parameters.SizeOfIOA + 10
                    retVal = new Lib60870.prototype.SetpointCommandNormalizedWithCP56Time2a(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_SE_TB_1: //62 - Setpoint command, scaled value with CP56Time2a
                    elementSize = this.parameters.SizeOfIOA + 10
                    retVal = new Lib60870.prototype.SetpointCommandScaledWithCP56Time2a(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_SE_TC_1: //63 - Setpoint command, short value with CP56Time2a
                    elementSize = this.parameters.SizeOfIOA + 12
                    retVal = new Lib60870.prototype.SetpointCommandShortWithCP56Time2a(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_BO_TA_1: //64 - Bitstring command with CP56Time2a
                    elementSize = this.parameters.SizeOfIOA + 11
                    retVal = new Lib60870.prototype.Bitstring32CommandWithCP56Time2a(this.parameters, this.payload, index * elementSize)
                    break
                    //65 - 69 reserved
                case Lib60870.prototype.TypeID.M_EI_NA_1: //70 - End of initialization
                    elementSize = this.parameters.SizeOfCA + 1
                    retVal = new Lib60870.prototype.EndOfInitialization(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_IC_NA_1: //100 - Interrogation command
                    elementSize = this.parameters.SizeOfIOA + 1
                    retVal = new Lib60870.prototype.InterrogationCommand(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_CI_NA_1: //101 - Counter interrogation command
                    elementSize = this.parameters.SizeOfIOA + 1
                    retVal = new Lib60870.prototype.CounterInterrogationCommand(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_RD_NA_1: //102 - Read command
                    elementSize = this.parameters.SizeOfIOA
                    retVal = new Lib60870.prototype.ReadCommand(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_CS_NA_1: //103 - Clock synchronization command
                    elementSize = this.parameters.SizeOfIOA + 7
                    retVal = new Lib60870.prototype.ClockSynchronizationCommand(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_TS_NA_1: //104 - Test command
                    elementSize = this.parameters.SizeOfIOA + 2
                    retVal = new Lib60870.prototype.TestCommand(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_RP_NA_1: //105 - Reset process command
                    elementSize = this.parameters.SizeOfIOA + 1
                    retVal = new Lib60870.prototype.ResetProcessCommand(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_CD_NA_1: //106 - Delay acquisition command
                    elementSize = this.parameters.SizeOfIOA + 2
                    retVal = new Lib60870.prototype.DelayAcquisitionCommand(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.C_TS_TA_1: //107 - Test command with CP56Time2a
                    elementSize = this.parameters.SizeOfIOA + 9
                    retVal = new Lib60870.prototype.TestCommandWithCP56Time2a(this.parameters, this.payload, index * elementSize)
                    break
                    //C_TS_TA_1 (107) is handled by the stack automatically
                case Lib60870.prototype.TypeID.P_ME_NA_1: //110 - Parameter of measured values, normalized value
                    elementSize = this.parameters.SizeOfIOA + 3
                    retVal = new Lib60870.prototype.ParameterNormalizedValue(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.P_ME_NB_1: //111 - Parameter of measured values, scaled value
                    elementSize = this.parameters.SizeOfIOA + 3
                    retVal = new Lib60870.prototype.ParameterScaledValue(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.P_ME_NC_1: //112 - Parameter of measured values, short floating point number
                    elementSize = this.parameters.SizeOfIOA + 5
                    retVal = new Lib60870.prototype.ParameterFloatValue(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.P_AC_NA_1: //113 - Parameter for activation
                    elementSize = this.parameters.SizeOfIOA + 1
                    retVal = new Lib60870.prototype.ParameterActivation(this.parameters, this.payload, index * elementSize)
                    break
                case Lib60870.prototype.TypeID.F_FR_NA_1: //120 - File ready
                    retVal = new Lib60870.prototype.FileReady(this.parameters, this.payload, 0, false)
                    break
                case Lib60870.prototype.TypeID.F_SR_NA_1: //121 - Section ready
                    retVal = new Lib60870.prototype.SectionReady(this.parameters, this.payload, 0, false)
                    break
                case Lib60870.prototype.TypeID.F_SC_NA_1: //122 - Call directory, select file, call file, call section
                    retVal = new Lib60870.prototype.FileCallOrSelect(this.parameters, this.payload, 0, false)
                    break
                case Lib60870.prototype.TypeID.F_LS_NA_1: //123 - Last section, last segment
                    retVal = new Lib60870.prototype.FileLastSegmentOrSection(this.parameters, this.payload, 0, false)
                    break
                case Lib60870.prototype.TypeID.F_AF_NA_1: //124 - ACK file, ACK section
                    retVal = new Lib60870.prototype.FileACK(this.parameters, this.payload, 0, false)
                    break
                case Lib60870.prototype.TypeID.F_SG_NA_1: //125 - Segment
                    retVal = new Lib60870.prototype.FileSegment(this.parameters, this.payload, 0, false)
                    break
                case Lib60870.prototype.TypeID.F_DR_TA_1: //126 - Directory
                    elementSize = 13
                    if (this.IsSequence) {
                        const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                        retVal = new Lib60870.prototype.FileDirectory(this.parameters, this.payload, this.parameters.SizeOfIOA + (index * elementSize), true)
                        retVal.ObjectAddress = ioa + index
                    } else {
                        retVal = new Lib60870.prototype.FileDirectory(this.parameters, this.payload, index * (this.parameters.SizeOfIOA + elementSize), false)
                    }
                    break
                    //114 - 119 reserved
                default:
                    if (privateObjectTypes != null) {
                        const ioFactory = privateObjectTypes.GetFactory(this.typeId)
                        if (ioFactory != null) {
                            elementSize = this.parameters.SizeOfIOA + ioFactory.GetEncodedSize()
                            if (this.IsSequence) {
                                const ioa = Lib60870.prototype.ParseInformationObjectAddress(this.parameters, this.payload, 0)
                                retVal = ioFactory.Decode(this.parameters, this.payload, index * elementSize, true)
                                retVal.ObjectAddress = ioa + index
                            } else {
                                retVal = ioFactory.Decode(this.parameters, this.payload, index * elementSize, false)
                            }
                        }
                    }
                    break
            }
            if (retVal == null) {
                throw new Lib60870.prototype.ASDUParsingException('Unknown ASDU type id:' + this.typeId)
            }
            return retVal
        }

        externalASDU(parameters, msg, bufPos, msgLength) {
            if ((this.vsq & 0x80) != 0) {
                this.isSequence = true
            } else {
                this.isSequence = false
            }
            this.parameters = parameters
            const asduHeaderSize = 2 + parameters.SizeOfCOT + parameters.SizeOfCA
            if ((msgLength - bufPos) < asduHeaderSize) {
                throw new Lib60870.prototype.ASDUParsingException('Message header too small')
            }
            this.typeId = Lib60870.prototype.GetTypeIdValue(msg[bufPos++])
            this.vsq = msg[bufPos++]
            this.hasTypeId = true
            const cotByte = msg[bufPos++]
            if ((cotByte & 0x80) != 0) {
                this.isTest = true
            } else {
                this.isTest = false
            }
            if ((cotByte & 0x40) != 0) {
                this.isNegative = true
            } else {
                this.isNegative = false
            }
            this.cot = Lib60870.prototype.GetCotValue(cotByte & 0x3f)
            if (parameters.SizeOfCOT == 2) {
                this.oa = msg[bufPos++]
            }
            this.ca = msg[bufPos++]
            if (parameters.SizeOfCA > 1) {
                this.ca += (msg[bufPos++] * 0x100)
            }
            const payloadSize = msgLength - bufPos

            //TODO add plausibility check for payload length (using TypeID, SizeOfIOA, and VSQ)
            this.payload = new Uint8Array(payloadSize)
            let count = -1
            for (const [index, value] of Object.entries(msg)) {
                if (index >= bufPos && index < (bufPos + payloadSize)) {
                    count++
                    this.payload[count] = value
                }
            }
        }

        AddInformationObject(io) {
            if (this.informationObjects == null) {
                this.informationObjects = [] //new List<InformationObject>();
            }
            if (this.hasTypeId) {
                if (io.Type != this.typeId) {
                    throw new Error('Invalid information object type: expected ' + this.typeId.ToString() + ' was ' + io.Type.ToString())
                }
            } else {
                this.typeId = io.Type
                this.hasTypeId = true
            }

            if (this.informationObjects.length >= 0x7f) {
                return false
            }
            let objectSize = io.GetEncodedSize()

            if (this.IsSequence == false) {
                objectSize += this.parameters.SizeOfIOA
            } else {
                if (this.informationObjects.length == 0) {// is first object?
                    objectSize += this.parameters.SizeOfIOA
                } else {
                    if (io.ObjectAddress != (this.informationObjects[0].ObjectAddress + this.informationObjects.length)) {
                        return false
                    }
                }
            }
            if (objectSize <= this.spaceLeft) {
                this.spaceLeft -= objectSize
                this.informationObjects.push(io)
                this.vsq = Lib60870.prototype.GetByteValue(((this.vsq & 0x80) | this.informationObjects.length))
                return true
            } else {
                return false
            }
        }
        Encode(frame, parameters) {
            frame.SetNextByte(Lib60870.prototype.GetByteValue(this.typeId))
            frame.SetNextByte(Lib60870.prototype.GetByteValue(this.vsq))
            let cotByte = Lib60870.prototype.GetByteValue(this.cot)
            if (this.isTest) {
                cotByte = Lib60870.prototype.GetByteValue((cotByte | 0x80))
            }
            if (this.isNegative) {
                cotByte = Lib60870.prototype.GetByteValue((cotByte | 0x40))
            }
            frame.SetNextByte(cotByte)
            if (parameters.SizeOfCOT == 2) {
                frame.SetNextByte(Lib60870.prototype.GetByteValue(this.oa))
            }
            frame.SetNextByte(Lib60870.prototype.GetByteValue((this.ca % 256)))
            if (parameters.SizeOfCA > 1) {
                frame.SetNextByte(Lib60870.prototype.GetByteValue((this.ca / 256)))
            }
            let isFirst: boolean
            if (this.payload != null) {
                frame.AppendBytes(this.payload)
            } else {
                isFirst = true
            }
            const $this = this
            this.informationObjects.forEach(function(io, index) {
                if (isFirst) {
                    io.Encode(frame, parameters, false)
                    isFirst = false
                } else {
                    if ($this.IsSequence) {
                        io.Encode(frame, parameters, true)
                    } else {
                        io.Encode(frame, parameters, false)
                    }
                }
                $this.informationObjects[index] = io
            })
        }
    }
}
