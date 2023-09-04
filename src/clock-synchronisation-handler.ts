export function clockSynchronisationHandler(Lib60870) {
    Lib60870.prototype.clockSynchronisationHandler = function(parameter, connection, asdu, newTime) {
        console.warn('ClockSynchronisation to ' + newTime.ToString())
        const cp = connection.GetApplicationLayerParameters()
        connection.SendACT_CON(asdu, false)
        return true
    }
}
