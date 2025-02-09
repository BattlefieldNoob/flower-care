import { Context, Effect, Layer, pipe } from 'effect';
import { tryPromise, flatMap, map, succeed } from 'effect/Effect';
import { Either, left, right } from 'effect/Either';
import { MiFlora, MiFloraModule } from '../models/miflora-module.interface';
import { MiFloraDevice } from '../models/miflora-device.interface';
import { DeviceSerialQueryResult } from '../models/device-serial-query-result.type';
import { SensorDataQueryResult } from '../models/sensor-data-query-result.type';
import { MiFloraModuleLive } from './miflora-ble.module';

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

function toError(e: unknown): Error {
    return e instanceof Error ? e : new Error(String(e));
}

export class FlowerCare extends Context.Tag("FlowerCareModule")<FlowerCareModule,{
    discoverAndConnect: (macAddress: string) => Effect.Effect<MiFloraDevice, DiscoverError | ConnectError>,
    disconnect: (device: MiFloraDevice) => Effect.Effect<void, DisconnectError>,
    executeDeviceSerialQuery: (device: MiFloraDevice) => Effect.Effect<DeviceSerialQueryResult, QueryError>,
    executeSensorDataQuery: (device: MiFloraDevice) => Effect.Effect<SensorDataQueryResult, QueryError> 
}>() {}

export class FlowerCareModule {
    constructor(private readonly miflorableModule: MiFlora) { }

    discoverAndConnect(macAddress: string): Effect.Effect<MiFloraDevice, DiscoverError | ConnectError> {
        return this.discover(macAddress).pipe(
            flatMap((devices) => this.validateDevices(devices, macAddress)),
            flatMap((device) => pipe(
                this.connect(device),
                flatMap(() => succeed(device))
            ))
        );
    }

    disconnect(device: MiFloraDevice): Effect.Effect<void, DisconnectError> {
        return tryPromise({
            try: () => this.miflorableModule.disconnect(device),
            catch: (err) => {
                return {
                    _tag: 'disconnectError',
                    macAddress: device.address,
                    message: toError(err).message
                };
            }
        })
    }

    executeDeviceSerialQuery(device: MiFloraDevice): Effect.Effect<DeviceSerialQueryResult, QueryError> {
        return tryPromise({
            try: () => this.miflorableModule.querySerial(device),
            catch: (err) => {
                return {
                    _tag: 'queryError',
                    macAddress: device.address,
                    message: toError(err).message
                };
            }
        });
    }

    executeSensorDataQuery(device: MiFloraDevice): Effect.Effect<SensorDataQueryResult, QueryError> {
        return tryPromise({
            try: () => this.miflorableModule.query(device),
            catch: (err) => {
                return {
                    _tag: 'queryError',
                    macAddress: device.address,
                    message: toError(err).message
                };
            }
        });
    }

    private discover(macAddress: string): Effect.Effect<MiFloraDevice[], DiscoverError> {
        const opts = {
            duration: 5000,
            ignoreUnknown: true,
            addresses: [macAddress]
        };
        return tryPromise({
            try: async () => this.miflorableModule.discover(opts),
            catch: (err) => {
                return {
                    _tag: 'discoverError',
                    macAddress: macAddress,
                    message: toError(err).message
                } as DiscoverError;
            }
        })
    }

    private validateDevices(devices: MiFloraDevice[], macAddress: string): Either<MiFloraDevice, DiscoverError> {
        if (devices.length > 0)
            return right(devices[0]);
        else
            return left({
                _tag: 'discoverError',
                macAddress: macAddress,
                message: 'Device not found'
            });
    }

    private connect(device: MiFloraDevice): Effect.Effect<void, ConnectError> {
        return tryPromise({
            try: () => this.miflorableModule.connect(device),
            catch: (err) => {
                return {
                    _tag: 'connectError',
                    macAddress: device.address,
                    message: toError(err).message
                };
            }
        });
    }
}

export const FlowerCareModuleLive = Layer.effect(
    FlowerCare,
    Effect.gen(function* () {
        const miflorableModule = yield* MiFloraModule
        return new FlowerCareModule(miflorableModule)
    })
)
