export function interrogationHandler(Lib60870) {
    Lib60870.prototype.interrogationHandler = function(parameter, connection, asdu, qoi) {
        const cp = connection.GetApplicationLayerParameters()
        connection.SendACT_CON(asdu, false)
        let newAsdu: any = null
        const ActivePower = Lib60870.prototype.informationObjects[1] ?? 0
        const OlcRate = Lib60870.prototype.informationObjects[7] ?? 0
        const OlcMode = Lib60870.prototype.informationObjects[11] ?? false

        newAsdu = new Lib60870.prototype.ASDU(cp, Lib60870.prototype.CauseOfTransmission.INTERROGATED_BY_STATION, false, false, 2, 1, false)
        newAsdu.AddInformationObject(new Lib60870.prototype.MeasuredValueShort(2, 12.3, new Lib60870.prototype.QualityDescriptor())) //ACTUAL value for wind farm feedin active power
        newAsdu.AddInformationObject(new Lib60870.prototype.MeasuredValueShort(3, ActivePower, new Lib60870.prototype.QualityDescriptor()))//ACTUAL value for wind farm active power controller input, Smallest of all possible setpoints (direct seller, network operator, customer, grid code etc.)
        newAsdu.AddInformationObject(new Lib60870.prototype.MeasuredValueShort(4, 30, new Lib60870.prototype.QualityDescriptor()))//Power installed in the wind farm
        newAsdu.AddInformationObject(new Lib60870.prototype.MeasuredValueShort(5, 100, new Lib60870.prototype.QualityDescriptor()))//Direct seller's TARGET value feedback
        newAsdu.AddInformationObject(new Lib60870.prototype.MeasuredValueShort(8, 90, new Lib60870.prototype.QualityDescriptor()))//ACTUAL wind farm wind direction (wind farm mean value)
        newAsdu.AddInformationObject(new Lib60870.prototype.MeasuredValueShort(9, 12.6, new Lib60870.prototype.QualityDescriptor()))//ACTUAL wind farm wind speed (wind farm mean value)
        newAsdu.AddInformationObject(new Lib60870.prototype.MeasuredValueShort(12, 100, new Lib60870.prototype.QualityDescriptor()))//Network operator's maximum active feed-in power TARGET value feedback
        newAsdu.AddInformationObject(new Lib60870.prototype.MeasuredValueShort(13, 12.6, new Lib60870.prototype.QualityDescriptor()))//ACTUAL value of the theoretically available gross capacity
        newAsdu.AddInformationObject(new Lib60870.prototype.MeasuredValueShort(14, 13.5, new Lib60870.prototype.QualityDescriptor()))//Fed-in electrical energy of the elapsed 1/4 hour
        newAsdu.AddInformationObject(new Lib60870.prototype.MeasuredValueShort(15, 13.5, new Lib60870.prototype.QualityDescriptor()))//Theoretically available energy of the elapsed 1/4 hour
        newAsdu.AddInformationObject(new Lib60870.prototype.MeasuredValueShort(17, OlcRate, new Lib60870.prototype.QualityDescriptor()))//OLC rate feedback
        console.warn('MeasuredValueShort', 'Send')
        connection.SendASDU(newAsdu)

        newAsdu = new Lib60870.prototype.ASDU(cp, Lib60870.prototype.CauseOfTransmission.INTERROGATED_BY_STATION, false, false, 2, 1, false)
        newAsdu.AddInformationObject(new Lib60870.prototype.SinglePointWithCP56Time2a(16, OlcMode, new Lib60870.prototype.QualityDescriptor(), new Lib60870.prototype.CP56Time2a(new Date()))) //OLC mode feedback
        console.warn('SinglePointWithCP56Time2a', 'Send')
        connection.SendASDU(newAsdu)

        newAsdu = new Lib60870.prototype.ASDU(cp, Lib60870.prototype.CauseOfTransmission.INTERROGATED_BY_STATION, false, false, 2, 1, false)
        newAsdu.AddInformationObject(new Lib60870.prototype.MeasuredValueScaled(10, 8, new Lib60870.prototype.QualityDescriptor()))
        newAsdu.AddInformationObject(new Lib60870.prototype.MeasuredValueScaled(11, 23, new Lib60870.prototype.QualityDescriptor()))
        console.warn('MeasuredValueScaled', 'Send')
        connection.SendASDU(newAsdu)

        connection.SendACT_TERM(asdu)
        return true
    }
}
