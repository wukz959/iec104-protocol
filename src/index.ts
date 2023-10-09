import { helper } from './60870-helper'
import { utils } from './utils'
import { applicationLayerParameters } from './application-layer-parameters'
import { apciParameters } from './apci-parameters'
import { informationObject } from './information-object'
import { informationObjectNormalized } from './information-object-normalized'
import { systemInformationCommands } from './system-information-commands'
import { setpointCommand } from './setpoint-command'
import { clockSynchronizationCommand } from './clock-synchronization-command'
import { measuredValueScaled } from './measured-value-scaled'
import { measuredValueShort } from './measured-value-short'
import { scaledValue } from './scaled-value'
import { connection } from './connection'
import { connectionStatistics  } from './connection-statistics'
import { qualityDescriptor } from './quality-descriptor'
import { cp24Time2a } from './cp24-time-2a'
import { cp56Time2a } from './cp56-time-2a'
import { interrogationCommand } from './interrogation-command'
import { singleCommand } from './single-command'
import { testCommand } from './test-command'
import { exception } from './exceptions'
import { connectionHandler } from './connection-handler'
import { interrogationHandler } from './interrogation-handler'
import { asduHandler  } from './asdu-handler'
import { asduReceivedHandler } from './asdu-received-handler'
import { clockSynchronisationHandler } from './clock-synchronisation-handler'
import { asdu  } from './asdu'
import { bufferFrame } from './buffer-frame'
import { setpointCommandQualifier } from './setpoint-command-qualifier'
import { endOfInitialization } from './end-of-initialization'
import { counterInterrogationCommand } from './counter-interrogation-command'
import { singlePointInformation } from './single-point-information'
import { measuredValueNormalized } from './measured-value-normalized'
import { slave } from './slave'
import { server } from './server'
import { clientConnection } from './client-connection'

function Lib60870() {}
Lib60870.prototype.constructor = Lib60870
helper(Lib60870)
utils(Lib60870)
applicationLayerParameters(Lib60870)
apciParameters(Lib60870)
informationObject(Lib60870)
informationObjectNormalized(Lib60870)
systemInformationCommands(Lib60870)
setpointCommand(Lib60870)
clockSynchronizationCommand(Lib60870)
measuredValueScaled(Lib60870)
measuredValueShort(Lib60870)
scaledValue(Lib60870)
connection(Lib60870)
connectionStatistics(Lib60870)
qualityDescriptor(Lib60870)
cp24Time2a(Lib60870)
cp56Time2a(Lib60870)
interrogationCommand(Lib60870)
singleCommand(Lib60870)
testCommand(Lib60870)
exception(Lib60870)
connectionHandler
interrogationHandler(Lib60870)
asduHandler(Lib60870)
asduReceivedHandler(Lib60870)
clockSynchronisationHandler(Lib60870)
asdu(Lib60870)
bufferFrame(Lib60870)
setpointCommandQualifier(Lib60870)
endOfInitialization(Lib60870)
counterInterrogationCommand(Lib60870)
singlePointInformation(Lib60870)
measuredValueNormalized(Lib60870)
slave(Lib60870)
server(Lib60870)
clientConnection(Lib60870)

export const Lib = Lib60870

export interface Data {
  IOA?: number,
  MeasuredValueShort?: number,
  SinglePointInformation?: number,
  Quality?: string,
  MeasuredValueNormalizedWithoutQuality?: number,
  SinglePointWithCP24Time2a?: number,
  SinglePointWithCP56Time2a?: number
  Timestamp?: string,
  MeasuredValueScaled?: number,
  SetpointCommandShort?: number,
  MeasuredValueScaledWithCP56Time2a?: number,
  DoubleCommand?: string,
  val?: any
}

export interface Option {
  autoReconnect?: boolean
}

export class Protocol {
  public ip: string
  public port: number
  public onRecievedData: (data: Data[]) => void

  private lib60870 = Lib60870
  private connection: any

  constructor(ip: string, port: number, onRecievedData: (data: Data[]) => void, options?: Option) {
    this.ip = ip
    this.port = port
    this.onRecievedData = onRecievedData

    const parameter = { onRecievedData: this.onRecievedData }
    
    this.connection = new Lib.prototype.Connection(this.ip, this.port)
    this.connection.SetASDUReceivedHandler(this.lib60870.prototype.asduReceivedHandler,parameter)
    if (options?.autoReconnect) {
      this.connection.SetReconnect(options.autoReconnect)
    }
  }

  public connect() {
    this.connection.Connect()
  }

}