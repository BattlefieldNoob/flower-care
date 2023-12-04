import { Context, Effect, Either, Layer, pipe } from 'effect';
import { tryPromise } from 'effect/Effect';
import { flatMap } from 'effect/Either';
import { MiFloraDevice, MiFloraModule } from './miflora-ble.module';

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

export interface FlowerCareModule {
    discoverAndConnect(macAddress: string): Effect.Effect<never, DiscoverError | ConnectError, MiFloraDevice>;
    disconnect(device: MiFloraDevice): Effect.Effect<never, DisconnectError, void>;
    executeDeviceSerialQuery(device: MiFloraDevice): Effect.Effect<never, QueryError, DeviceSerialQueryResult>;
    executeSensorDataQuery(device: MiFloraDevice): Effect.Effect<never, QueryError, SensorDataQueryResult>;
}

export const FlowerCareModule = Context.Tag<FlowerCareModule>();

export const FlowerCareModuleLive = Layer.effect(
    FlowerCareModule,
    Effect.map(MiFloraModule, (miflorableModule) => FlowerCareModule.of(new FlowerCareModuleImpl(miflorableModule)))
)

export class FlowerCareModuleImpl implements FlowerCareModule {
    constructor(private readonly miflorableModule: MiFloraModule) { }

    discoverAndConnect(macAddress: string): Effect.Effect<never, DiscoverError | ConnectError, MiFloraDevice> {
        return pipe(
            this.discover(macAddress),
            flatMap((devices) => this.validateDevices(devices, macAddress)),
            flatMap((device) => pipe(
                this.connect(device),
                flatMap(() => Either.right(device))
            ))
        );
    }

    disconnect(device: MiFloraDevice): Effect.Effect<never, DisconnectError, void> {
        return pipe(
            tryPromise({
                try: () => this.miflorableModule.disconnect(device),
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

    executeDeviceSerialQuery(device: MiFloraDevice): Effect.Effect<never, QueryError, DeviceSerialQueryResult> {
        return pipe(
            tryPromise({
                try: () => this.miflorableModule.querySerial(device),
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

    executeSensorDataQuery(device: MiFloraDevice): Effect.Effect<never, QueryError, SensorDataQueryResult> {
        return pipe(
            tryPromise({
                try: () => this.miflorableModule.query(device),
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

    private discover(macAddress: string): Effect.Effect<never, DiscoverError, MiFloraDevice[]> {
        const opts = {
            duration: 5000,
            ignoreUnknown: true,
            addresses: [macAddress]
        };
        return pipe(
            Effect.tryPromise({
                try: () => this.miflorableModule.discover(opts),
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

    private validateDevices(devices: MiFloraDevice[], macAddress: string): Either.Either<DiscoverError, MiFloraDevice> {
        if (devices.length > 0)
            return Either.right(devices[0]);
        else
            return Either.left({
                _tag: 'discoverError',
                macAddress: macAddress,
                message: 'Device not found'
            });
    }

    private connect(device: MiFloraDevice): Effect.Effect<never, ConnectError, void> {
        return pipe(
            Effect.tryPromise({
                try: () => this.miflorableModule.connect(device),
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
