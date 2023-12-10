import { SensorData } from '@flower-care/libs/data-models';
import { FirmwareInfo } from './firmware-info.type';

export type SensorDataQueryResult = {
    address: string,
    type: string,
    _tag: string,
    firmwareInfo: FirmwareInfo,
    sensorValues: SensorData
}
