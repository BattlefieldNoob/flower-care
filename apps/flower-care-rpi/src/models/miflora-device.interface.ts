import { DeviceSerialQueryResult } from "./device-serial-query-result.type";
import { SensorDataQueryResult } from "./sensor-data-query-result.type";

export interface MiFloraDevice {
    address: string;
    name: string;
    rssi: number;
    connect(): Promise<MiFloraDevice>;
    disconnect(): Promise<void>;
    querySerial(): Promise<DeviceSerialQueryResult>;
    query(): Promise<SensorDataQueryResult>;
}
