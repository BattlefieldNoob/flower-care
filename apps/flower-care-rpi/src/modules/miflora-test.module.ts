import { Layer } from "effect";
import { MiFloraDevice } from "../models/miflora-device.interface";
import { DeviceSerialQueryResult } from "../models/device-serial-query-result.type";
import { SensorQueryResult } from "../models/sensor-data-query-result.type";
import { MiFloraModule } from "../models/miflora-module.interface";


const mockDevice: MiFloraDevice = {
    connect: async () => {
        return mockDevice;
    },
    disconnect: async () => {
        return;
    },
    address: "",
    name: "",
    rssi: 0,
    querySerial: function (): Promise<DeviceSerialQueryResult> {
        return Promise.resolve({
            address: '',
            type: '',
            _tag: '',
            serial: ''
        });
    },
    query: function (): Promise<SensorQueryResult> {
        return Promise.resolve({
            address: '',
            type: '',
            _tag: '',
            firmwareInfo: {
                battery: 0,
                firmware: ''
            },
            sensorValues: {
                temperature: 0,
                lux: 0,
                moisture: 0,
                fertility: 0
            }
        });
    }
};


const MiFloraTest: MiFloraModule = {
    discover: function (): Promise<MiFloraDevice[]> {
        console.log('Mock Discovering...');
        return Promise.resolve([mockDevice]);
    },
    connect: function (): Promise<MiFloraDevice> {
        console.log('Mock Connecting...');
        return Promise.resolve(mockDevice);
    },
    disconnect: function (): Promise<void> {
        console.log('Mock Disconnecting...');
        return Promise.resolve();
    },
    querySerial: function (device: MiFloraDevice): Promise<DeviceSerialQueryResult> {
        console.log('Mock Querying Serial...');
        return device.querySerial();
    },
    query: function (device: MiFloraDevice): Promise<SensorQueryResult> {
        console.log('Mock Querying...');
        return device.query();
    }
};

export const MiFloraModuleTest = Layer.succeed(
    MiFloraModule,
    MiFloraModule.of(MiFloraTest)
)
