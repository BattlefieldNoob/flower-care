import { toError } from 'fp-ts/lib/Either';
import { TaskEither, flatMap, left, mapLeft, of, tryCatch } from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import * as miflora from 'miflora';

type DiscoverError = {
    type: 'discoverError';
    message: string;
    macAddress: string;
};

type ConnectError = {
    type: 'connectError';
    message: string;
    macAddress: string;
};

type DisconnectError = {
    type: 'disconnectError';
    message: string;
    macAddress: string;
};

type QueryError = {
    type: 'queryError';
    message: string;
    macAddress: string;
};

type FirmwareInfo = {
    battery: number;
    firmware: string;
};

type SensorData = {
    temperature: number;
    lux: number;
    moisture: number;
    fertility: number;
};

type SensorDataQueryResult = {
    address: string,
    type: string,
    firmwareInfo: FirmwareInfo,
    sensorValues: SensorData
}

type DeviceSerialQueryResult = {
    address: string,
    type: string,
    serial: string
}

export class FlowerCareModule {

    discoverAndConnect(macAddress: string): TaskEither<DiscoverError | ConnectError, miflora.MiFloraDevice> {
        return pipe(
            this.discover(macAddress),
            flatMap((devices) => this.validateDevices(devices, macAddress)),
            flatMap((device) => pipe(
                this.connect(device),
                flatMap(() => of(device))
            ))
        );
    }

    executeDeviceSerialQuery(device: miflora.MiFloraDevice): TaskEither<QueryError, DeviceSerialQueryResult> {
        return pipe(
            tryCatch(() =>
                device.querySerial() as Promise<DeviceSerialQueryResult>,
                toError),
            mapLeft((err) => {
                return {
                    type: 'queryError',
                    macAddress: device.address,
                    message: err.message
                };
            }))
    }

    executeSensorDataQuery(device: miflora.MiFloraDevice): TaskEither<QueryError, SensorDataQueryResult> {
        return pipe(
            tryCatch(() =>
                device.query() as Promise<SensorDataQueryResult>,
                toError),
            mapLeft((err) => {
                return {
                    type: 'queryError',
                    macAddress: device.address,
                    message: err.message
                };
            }))
    }

    disconnect(device: miflora.MiFloraDevice): TaskEither<DisconnectError, void> {
        return pipe(
            tryCatch(() =>
                device.disconnect() as Promise<void>,
                toError),
            mapLeft((err) => {
                return {
                    type: 'disconnectError',
                    macAddress: device.address,
                    message: err.message
                };
            }))
    }

    private validateDevices(devices: miflora.MiFloraDevice[], macAddress: string): TaskEither<DiscoverError, miflora.MiFloraDevice> {
        if (devices.length > 0)
            return of(devices[0]);
        else
            return left({
                type: 'discoverError',
                macAddress: macAddress,
                message: 'Device not found'
            });
    }

    private discover(macAddress: string): TaskEither<DiscoverError, miflora.MiFloraDevice[]> {
        const opts = {
            duration: 5000,
            ignoreUnknown: true,
            addresses: [macAddress]
        };
        return pipe(
            tryCatch(
                () => miflora.discover(opts) as Promise<miflora.MiFloraDevice[]>,
                toError),
            mapLeft((err) => {
                return {
                    type: 'discoverError',
                    macAddress: macAddress,
                    message: err.message
                };
            })
        );
    }

    private connect(device: miflora.MiFlora): TaskEither<ConnectError, void> {
        return pipe(
            tryCatch(
                () => device.connect() as Promise<void>,
                toError),
            mapLeft((err) => {
                return {
                    type: 'connectError',
                    macAddress: device.address,
                    message: err.message
                };
            }));
    }
}
