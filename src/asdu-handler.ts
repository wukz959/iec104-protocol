export function asduHandler(Lib60870) {
    Lib60870.prototype.asduHandler = function(parameter, connection, asdu) {
        //console.log("ASDU Handler Type " + asdu.TypeId);
        //console.warn('Parameter: ', parameter);
        //console.warn('Connection: ', connection);
        //console.warn('ASDU: ', asdu);
        let handled = false
        if (asdu.TypeId === Lib60870.prototype.TypeID.C_SC_NA_1) { //45: SingleCommand
            const sc = asdu.GetElement(0)
            console.warn('SingleCommand: IOA: ' + sc.ObjectAddress + ', State: ' + sc.State.ToString() + ', Quality: ' + sc.QU.ToString())
            handled = true
        } else if (asdu.TypeId === Lib60870.prototype.TypeID.C_DC_NA_1) { //46: DoubleCommand
            const dc = asdu.GetElement(0)
            console.warn('DoubleCommand: IOA: ' + dc.ObjectAddress + ', State: ' + dc.State + ', Quality: ' + dc.QU)
            if (dc.ObjectAddress === 6) {
                const OlcMode = (dc.State === 1)
                const cp = connection.GetApplicationLayerParameters()
                const newAsdu = new Lib60870.prototype.ASDU(cp, Lib60870.prototype.CauseOfTransmission.INITIALIZED, false, false, 0, 1, false)
                newAsdu.AddInformationObject(new Lib60870.prototype.SinglePointWithCP56Time2a(16, OlcMode, new Lib60870.prototype.QualityDescriptor(), new Lib60870.prototype.CP56Time2a(new Date()))) //OLC mode feedback
                connection.SendASDU(newAsdu)
                Lib60870.prototype.informationObjects[16] = new Lib60870.prototype.InformationObjectNormalized(16, OlcMode, 'M_SP_TB_1', 'SinglePointWithCP56Time2a', new Lib60870.prototype.CP56Time2a(new Date()), new Lib60870.prototype.QualityDescriptor())
                Lib60870.prototype.EmitInformationObjects(Lib60870.prototype.informationObjects)
            }
            handled = true
        } else if (asdu.TypeId === Lib60870.prototype.TypeID.C_SE_NC_1) { //50: SetpointCommandShort
            const scs = asdu.GetElement(0)
            console.warn('SetpointCommandShort: IOA: ' + scs.ObjectAddress + ', Value: ' + scs.Value)
            if (scs.ObjectAddress === 1) {
                const ActivePower = scs.Value
                const cp = connection.GetApplicationLayerParameters()
                const newAsdu = new Lib60870.prototype.ASDU(cp, Lib60870.prototype.CauseOfTransmission.INITIALIZED, false, false, 0, 1, false)
                newAsdu.AddInformationObject(new Lib60870.prototype.MeasuredValueShort(3, ActivePower, new Lib60870.prototype.QualityDescriptor()))//ACTUAL value for wind farm active power controller input, Smallest of all possible setpoints (direct seller, network operator, customer, grid code etc.)
                connection.SendASDU(newAsdu)
                Lib60870.prototype.informationObjects[3] = new Lib60870.prototype.InformationObjectNormalized(3, ActivePower, 'M_ME_NC_1', 'MeasuredValueShort', null, new Lib60870.prototype.QualityDescriptor())
                Lib60870.prototype.EmitInformationObjects(Lib60870.prototype.informationObjects)
            }
            if (scs.ObjectAddress === 7) {
                const OlcRate = scs.Value
                const cp = connection.GetApplicationLayerParameters()
                const newAsdu = new Lib60870.prototype.ASDU(cp, Lib60870.prototype.CauseOfTransmission.INITIALIZED, false, false, 0, 1, false)
                newAsdu.AddInformationObject(new Lib60870.prototype.MeasuredValueShort(17, OlcRate, new Lib60870.prototype.QualityDescriptor()))//OLC rate feedback
                connection.SendASDU(newAsdu)
                Lib60870.prototype.informationObjects[17] = new Lib60870.prototype.InformationObjectNormalized(17, OlcRate, 'M_ME_NC_1', 'MeasuredValueShort', null, new Lib60870.prototype.QualityDescriptor())
                Lib60870.prototype.EmitInformationObjects(Lib60870.prototype.informationObjects)
            }
            handled = true
        } else if (asdu.TypeId === Lib60870.prototype.TypeID.C_CS_NA_1) { //103: ClockSyncCommand
            const qsc = asdu.GetElement(0)
            console.warn('Received clock sync command with time ' + qsc.NewTime.ToString())
            handled = true
        }
        return handled
    }
}
