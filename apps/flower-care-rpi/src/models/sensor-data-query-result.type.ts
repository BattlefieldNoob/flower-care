export type FirmwareInfo = {
    battery: number;
    firmware: string;
};

export type SensorData = {
    temperature: number;
    lux: number;
    moisture: number;
    fertility: number;
};

export type SensorDataRequest = {
    moisture: number;
    fertility: number;
    sunlight: number;
    temperature: number;
    battery: number;
    ts: string;
};

export type SensorDataQueryResult = {
    address: string,
    type: string,
    _tag: string,
    firmwareInfo: FirmwareInfo,
    sensorValues: SensorData
}
