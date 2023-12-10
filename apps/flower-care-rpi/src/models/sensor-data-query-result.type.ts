export type FirmwareInfo = {
    battery: number;
    firmware: string;
};

export type SensorData = {
    temperature: number;
    lux: number;
    moisture: number;
    fertility: number;
    ts?: string;
};

export type SensorDataQueryResult = {
    address: string,
    type: string,
    _tag: string,
    firmwareInfo: FirmwareInfo,
    sensorValues: SensorData
}
