import { Data } from './index'
export function asduReceivedHandler(Lib60870) {
    Lib60870.prototype.asduReceivedHandler = function (parameter, asdu) {
        let emit = false
        if (asdu.typeId == Lib60870.prototype.TypeID.M_SP_NA_1) { //1: SinglePointInformation
            const rets: Data[] = []
            for (let i = 0; i < asdu.NumberOfElements; i++) {
                emit = true
                const val = asdu.GetElement(i)
                if (val.ObjectAddress > 0) {
                    Lib60870.prototype.informationObjects[val.ObjectAddress] = new Lib60870.prototype.InformationObjectNormalized(val.ObjectAddress, val.Value, 'M_SP_NA_1', 'SinglePointInformation', null, null)
                    const jsonObject: Data = {}
                    jsonObject.IOA = val.ObjectAddress
                    jsonObject.SinglePointInformation = val.Value
                    jsonObject.Quality = val.Quality.ToString()
                    rets.push(jsonObject)
                }
            }
            parameter.onRecievedData(rets)
        } else if (asdu.typeId == Lib60870.prototype.TypeID.M_ME_ND_1) {
            const rets: Data[] = []
            for (let i = 0; i < asdu.NumberOfElements; i++) {
                emit = true
                const val = asdu.GetElement(i)
                Lib60870.prototype.informationObjects[val.ObjectAddress] = new Lib60870.prototype.InformationObjectNormalized(val.ObjectAddress, val.NormalizedValue, 'M_ME_ND_1', 'MeasuredValueNormalizedWithoutQuality', null, null)

                const jsonObject: any = {}
                jsonObject.IOA = val.ObjectAddress
                jsonObject.MeasuredValueNormalizedWithoutQuality = val.NormalizedValue
                rets.push(jsonObject)
            }
            parameter.onRecievedData(rets)
        } else if (asdu.typeId == Lib60870.prototype.TypeID.M_SP_TA_1) {
            const rets: Data[] = []
            for (let i = 0; i < asdu.NumberOfElements; i++) {
                emit = true
                const val = asdu.GetElement(i)
                Lib60870.prototype.informationObjects[val.ObjectAddress] = new Lib60870.prototype.InformationObjectNormalized(val.ObjectAddress, val.Value, 'M_SP_TA_1', 'SinglePointWithCP24Time2a', val.Timestamp, val.Quality)
                const jsonObject: any = {}
                jsonObject.IOA = val.ObjectAddress
                jsonObject.SinglePointWithCP24Time2a = val.Value
                jsonObject.Quality = val.Quality.ToString()
                jsonObject.Timestamp = val.Timestamp.ToString()
                rets.push(jsonObject)
            }
            parameter.onRecievedData(rets)
        } else if (asdu.typeId == Lib60870.prototype.TypeID.M_SP_TB_1) {
            const rets: Data[] = []
            for (let i = 0; i < asdu.NumberOfElements; i++) {
                emit = true
                const val = asdu.GetElement(i)
                Lib60870.prototype.informationObjects[val.ObjectAddress] = new Lib60870.prototype.InformationObjectNormalized(val.ObjectAddress, val.Value, 'M_SP_TB_1', 'SinglePointWithCP56Time2a', val.Timestamp, val.Quality)
                
                const jsonObject: any = {}
                jsonObject.IOA = val.ObjectAddress
                jsonObject.SinglePointWithCP56Time2a = val.Value
                jsonObject.Quality = val.Quality.ToString()
                jsonObject.Timestamp = val.Timestamp.ToString()
                rets.push(jsonObject)
            }
            parameter.onRecievedData(rets)
        } else if (asdu.typeId == Lib60870.prototype.TypeID.M_ME_NB_1) {
            const rets: Data[] = []
            for (let i = 0; i < asdu.NumberOfElements; i++) {
                emit = true
                const val = asdu.GetElement(i)
                Lib60870.prototype.informationObjects[val.ObjectAddress] = new Lib60870.prototype.InformationObjectNormalized(val.ObjectAddress, val.Value, 'M_ME_NB_1', 'MeasuredValueScaled', null, val.Quality)
                const jsonObject: any = {}
                jsonObject.IOA = val.ObjectAddress
                jsonObject.MeasuredValueScaled = val.ScaledValue.Value
                jsonObject.Quality = val.Quality.ToString()
                rets.push(jsonObject)
            }
            parameter.onRecievedData(rets)
        } else if (asdu.typeId == Lib60870.prototype.TypeID.C_SE_NC_1) {//表示某个设备或对象的状态是否开启或关闭
            const rets: Data[] = []
            for (let i = 0; i < asdu.NumberOfElements; i++) {
                emit = true
                const val = asdu.GetElement(i)
                const jsonObject: any = {}
                jsonObject.IOA = val.ObjectAddress
                jsonObject.SetpointCommandShort = val.Value
                jsonObject.Quality = val.Quality.ToString()
                jsonObject.Timestamp = val.Timestamp.ToString()
                rets.push(jsonObject)
                console.warn(jsonObject)
            }
            parameter.onRecievedData(rets)
        } else if (asdu.typeId == Lib60870.prototype.TypeID.M_ME_TE_1) {
            const rets: Data[] = []
            for (let i = 0; i < asdu.NumberOfElements; i++) {
                emit = true
                const val = asdu.GetElement(i)
                const jsonObject: any = {}
                jsonObject.IOA = val.ObjectAddress
                jsonObject.MeasuredValueScaledWithCP56Time2a = val.ScaledValue.Value
                jsonObject.Quality = val.Quality.ToString()
                jsonObject.Timestamp = val.Timestamp.ToString()
                rets.push(jsonObject)
            }
            parameter.onRecievedData(rets)
        } else if (asdu.typeId == 41) { //41
            const rets: Data[] = []
            for (let i = 0; i < asdu.NumberOfElements; i++) {
                emit = true
                const val = asdu.GetElement(i)
                rets.push({ val: val })
                console.warn(val)
            }
            parameter.onRecievedData(rets)
        } else if (asdu.typeId == Lib60870.prototype.TypeID.M_ME_NC_1) { //13: MeasuredValueShort
            const rets: Data[] = []
            for (let i = 0; i < asdu.NumberOfElements; i++) {
                emit = true
                const val = asdu.GetElement(i)
                Lib60870.prototype.informationObjects[val.ObjectAddress] = new Lib60870.prototype.InformationObjectNormalized(val.ObjectAddress, val.Value, 'M_ME_NC_1', 'MeasuredValueShort', null, val.Quality)
                const jsonObject: any = {}
                jsonObject.IOA = val.ObjectAddress
                jsonObject.MeasuredValueShort = val.Value
                rets.push(jsonObject)
            }
            parameter.onRecievedData(rets)
        } else if (asdu.typeId == Lib60870.prototype.TypeID.C_DC_NA_1) { //46
            const rets: Data[] = []
            for (let i = 0; i < asdu.NumberOfElements; i++) {
                emit = true
                const val = asdu.GetElement(i)
                Lib60870.prototype.informationObjects[val.ObjectAddress] = new Lib60870.prototype.InformationObjectNormalized(val.ObjectAddress, val.State, 'C_DC_NA_1', 'DoubleCommand', null, null)

                const jsonObject: any = {}
                jsonObject.IOA = val.ObjectAddress
                jsonObject.DoubleCommand = val.State
                rets.push(jsonObject)
            }
            parameter.onRecievedData(rets)
        } else if (asdu.typeId == Lib60870.prototype.TypeID.C_CS_NA_1) { //ClockSynchronizationCommand
            const rets: Data[] = []
            for (let i = 0; i < asdu.NumberOfElements; i++) {
                emit = true
                const val = asdu.GetElement(i)
                rets.push({ val: val })
            }
            parameter.onRecievedData(rets)
        } else if (asdu.typeId == Lib60870.prototype.TypeID.M_EI_NA_1) { //EndOfInitialization 70
            const rets: Data[] = []
            for (let i = 0; i < asdu.NumberOfElements; i++) {
                emit = true
                const val = asdu.GetElement(i)
                rets.push({ val: val })
                //console.warn(val);
            }
            parameter.onRecievedData(rets)
        } else if (asdu.typeId == Lib60870.prototype.TypeID.C_IC_NA_1) { //InterrogationCommand 100
            const rets: Data[] = []
            for (let i = 0; i < asdu.NumberOfElements; i++) {
                emit = true
                const val = asdu.GetElement(i)
                rets.push({ val: val })
                //console.warn(val);
            }
            parameter.onRecievedData(rets)
        } else {
            console.log('Unknown message type! (' + asdu.typeId + ')')
        }
        if (emit && Object.keys(Lib60870.prototype.informationObjects).length > 0) {
            Lib60870.prototype.EmitInformationObjects(Lib60870.prototype.informationObjects)
        }
        //console.warn(Lib60870.prototype.informationObjects);
    }
}
