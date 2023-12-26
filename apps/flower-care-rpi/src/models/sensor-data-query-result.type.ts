import { FirmwareInfo } from './firmware-info.type';
import { SensorValues } from './sensor-values.type';

export type SensorQueryResult = {
    address: string,
    type: string,
    _tag: string,
    firmwareInfo: FirmwareInfo,
    sensorValues: SensorValues
}
