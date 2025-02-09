import { Context } from "effect";
import { DeviceSerialQueryResult } from "./device-serial-query-result.type";
import { MiFloraDevice } from "./miflora-device.interface";
import { SensorDataQueryResult } from "./sensor-data-query-result.type";

export interface DiscoverOpt {
    duration: number;
    ignoreUnknown: boolean;
    addresses: string[];
}

export interface MiFlora {
    discover(opt: DiscoverOpt): Promise<MiFloraDevice[]>;
    connect(device: MiFloraDevice): Promise<MiFloraDevice>;
    disconnect(device: MiFloraDevice): Promise<void>;
    querySerial(device: MiFloraDevice): Promise<DeviceSerialQueryResult>;
    query(device: MiFloraDevice): Promise<SensorDataQueryResult>;
}

export class MiFloraModule extends Context.Tag("MiFloraModule")<MiFlora,{
    discover(opt: DiscoverOpt): Promise<MiFloraDevice[]>;
    connect(device: MiFloraDevice): Promise<MiFloraDevice>;
    disconnect(device: MiFloraDevice): Promise<void>;
    querySerial(device: MiFloraDevice): Promise<DeviceSerialQueryResult>;
    query(device: MiFloraDevice): Promise<SensorDataQueryResult>;
}>() {}
