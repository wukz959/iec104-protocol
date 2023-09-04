declare let running: any

export function connectionHandler(Lib60870) {
    Lib60870.prototype.ConnectionHandler = function(parameter, connectionEvent) {
        switch (connectionEvent) {
            case Lib60870.prototype.ConnectionEvent.OPENED:
                console.log('Connected')
                break
            case Lib60870.prototype.ConnectionEvent.CLOSED:
                console.log('Connection closed')
                running = false
                break
            case Lib60870.prototype.ConnectionEvent.STARTDT_CON_RECEIVED:
                console.log('STARTDT CON received')
                break
            case Lib60870.prototype.ConnectionEvent.STOPDT_CON_RECEIVED:
                console.log('STOPDT CON received')
                break
        }
    }
}
