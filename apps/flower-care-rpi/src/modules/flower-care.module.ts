import { Effect, Either, pipe } from 'effect';
import { tryMapPromise, tryPromise } from 'effect/Effect';
import { flatMap } from 'effect/Either';
import * as miflora from 'miflora';

type DiscoverError = {
    _tag: 'discoverError';
    message: string;
    macAddress: string;
};

type ConnectError = {
    _tag: 'connectError';
    message: string;
    macAddress: string;
};

type DisconnectError = {
    _tag: 'disconnectError';
    message: string;
    macAddress: string;
};

type QueryError = {
    _tag: 'queryError';
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
    _tag: string,
    firmwareInfo: FirmwareInfo,
    sensorValues: SensorData
}

type DeviceSerialQueryResult = {
    address: string,
    _tag: string,
    serial: string
}


function toError(e: unknown): Error {
    return e instanceof Error ? e : new Error(String(e));
}

export class FlowerCareModule {


    discoverAndConnect(macAddress: string): Effect.Effect<never, DiscoverError | ConnectError, miflora.MiFloraDevice> {
        return pipe(
            this.discover(macAddress),
            flatMap((devices) => this.validateDevices(devices, macAddress)),
            flatMap((device) => pipe(
                this.connect(device),
                flatMap(() => Either.right(device))
            ))
        );
    }

    disconnect(device: miflora.MiFloraDevice): Effect.Effect<never, DisconnectError, void> {
        return pipe(
            tryPromise({
                try: () => device.disconnect(),
                catch: (err) => {
                    return {
                        _tag: 'disconnectError',
                        macAddress: device.address,
                        message: toError(err).message
                    };
                }
            })
        )
    }

    executeDeviceSerialQuery(device: miflora.MiFloraDevice): Effect.Effect<never, QueryError, DeviceSerialQueryResult> {
        return pipe(
            tryPromise({
                try: () => device.querySerial(),
                catch: (err) => {
                    return {
                        _tag: 'queryError',
                        macAddress: device.address,
                        message: toError(err).message
                    };
                }
            })
        );
    }

    executeSensorDataQuery(device: miflora.MiFloraDevice): Effect.Effect<never, QueryError, SensorDataQueryResult> {
        return pipe(
            tryPromise({
                try: () => device.query() as Promise<SensorDataQueryResult>,
                catch: (err) => {
                    return {
                        _tag: 'queryError',
                        macAddress: device.address,
                        message: toError(err).message
                    };
                }
            })
        )
    }

    private discover(macAddress: string): Effect.Effect<never, DiscoverError, miflora.MiFloraDevice[]> {
        const opts = {
            duration: 5000,
            ignoreUnknown: true,
            addresses: [macAddress]
        };
        return pipe(
            Effect.tryPromise({
                try: () => miflora.discover(opts),
                catch: (err) => {
                    return {
                        _tag: 'discoverError',
                        macAddress: macAddress,
                        message: toError(err).message
                    };
                }
            })
        )
    }

    private validateDevices(devices: miflora.MiFloraDevice[], macAddress: string): Either.Either<DiscoverError, miflora.MiFloraDevice> {
        if (devices.length > 0)
            return Either.right(devices[0]);
        else
            return Either.left({
                _tag: 'discoverError',
                macAddress: macAddress,
                message: 'Device not found'
            });
    }

    private connect(device: miflora.MiFlora): Effect.Effect<never, ConnectError, void> {
        return pipe(
            Effect.tryPromise({
                try: () => device.connect(),
                catch: (err) => {
                    return {
                        _tag: 'connectError',
                        macAddress: device.address,
                        message: toError(err).message
                    };
                }
            })
        );
    }
}
