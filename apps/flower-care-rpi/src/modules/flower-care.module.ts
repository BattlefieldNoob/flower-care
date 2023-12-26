import { Context, Layer, pipe } from 'effect';
import { tryPromise, flatMap, map, Effect, succeed } from 'effect/Effect';
import { Either, left, right } from 'effect/Either';
import { MiFloraModule } from '../models/miflora-module.interface';
import { MiFloraDevice } from '../models/miflora-device.interface';
import { DeviceSerialQueryResult } from '../models/device-serial-query-result.type';
import { SensorQueryResult } from '../models/sensor-data-query-result.type';

export type DiscoverError = {
    _tag: 'discoverError';
    message: string;
    macAddress: string;
};

export type ConnectError = {
    _tag: 'connectError';
    message: string;
    macAddress: string;
};

export type DisconnectError = {
    _tag: 'disconnectError';
    message: string;
    macAddress: string;
};

export type QueryError = {
    _tag: 'queryError';
    message: string;
    macAddress: string;
};

function toError(e: unknown): Error {
    return e instanceof Error ? e : new Error(String(e));
}

export interface FlowerCareModule {
    discoverAndConnect(macAddress: string): Effect<never, DiscoverError | ConnectError, MiFloraDevice>;
    disconnect(device: MiFloraDevice): Effect<never, DisconnectError, void>;
    executeDeviceSerialQuery(device: MiFloraDevice): Effect<never, QueryError, DeviceSerialQueryResult>;
    executeSensorDataQuery(device: MiFloraDevice): Effect<never, QueryError, SensorQueryResult>;
}

export const FlowerCareModule = Context.Tag<FlowerCareModule>();

export const FlowerCareModuleLive = Layer.effect(
    FlowerCareModule,
    map(MiFloraModule, (miflorableModule) => FlowerCareModule.of(new FlowerCareModuleImpl(miflorableModule)))
)

export class FlowerCareModuleImpl implements FlowerCareModule {
    constructor(private readonly miflorableModule: MiFloraModule) { }

    discoverAndConnect(macAddress: string): Effect<never, DiscoverError | ConnectError, MiFloraDevice> {
        return this.discover(macAddress).pipe(
            flatMap((devices) => this.validateDevices(devices, macAddress)),
            flatMap((device) => pipe(
                this.connect(device),
                flatMap(() => succeed(device))
            ))
        );
    }

    disconnect(device: MiFloraDevice): Effect<never, DisconnectError, void> {
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

    executeDeviceSerialQuery(device: MiFloraDevice): Effect<never, QueryError, DeviceSerialQueryResult> {
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

    executeSensorDataQuery(device: MiFloraDevice): Effect<never, QueryError, SensorQueryResult> {
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

    private discover(macAddress: string): Effect<never, DiscoverError, MiFloraDevice[]> {
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

    private validateDevices(devices: MiFloraDevice[], macAddress: string): Either<DiscoverError, MiFloraDevice> {
        if (devices.length > 0)
            return right(devices[0]);
        else
            return left({
                _tag: 'discoverError',
                macAddress: macAddress,
                message: 'Device not found'
            });
    }

    private connect(device: MiFloraDevice): Effect<never, ConnectError, void> {
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
