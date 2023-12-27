import { Context, Layer, pipe } from 'effect';
import { tryPromise, flatMap, Effect, succeed, gen } from 'effect/Effect';
import { Either, left, right } from 'effect/Either';
import { MiFloraModule } from '../models/miflora-module.interface';
import { MiFloraDevice } from '../models/miflora-device.interface';
import { DeviceSerialQueryResult } from '../models/device-serial-query-result.type';
import { SensorQueryResult } from '../models/sensor-data-query-result.type';
import { SensorSample } from '@flower-care/libs/data-models';
import { HttpModule } from '../models/http-module.interface';

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

export type HttpError = {
    _tag: 'httpError';
    message: string;
};

function toError(e: unknown): Error {
    return e instanceof Error ? e : new Error(String(e));
}

export interface FlowerCareModule {
    discoverAndConnect(macAddress: string): Effect<never, DiscoverError | ConnectError, MiFloraDevice>;
    disconnect(device: MiFloraDevice): Effect<never, DisconnectError, void>;
    executeDeviceSerialQuery(device: MiFloraDevice): Effect<never, QueryError, DeviceSerialQueryResult>;
    executeSensorDataQuery(device: MiFloraDevice): Effect<never, QueryError, SensorQueryResult>;
    postSampleData(data: SensorSample): Effect<never, HttpError, void>;
}

export const FlowerCareModule = Context.Tag<FlowerCareModule>();

export const FlowerCareModuleLive = Layer.effect(
    FlowerCareModule,
    gen(function* (_) {
        const mifloraModule = yield* _(MiFloraModule);
        const httpModule = yield* _(HttpModule);
        return new FlowerCareModuleImpl(mifloraModule, httpModule);
    })
)

export class FlowerCareModuleImpl implements FlowerCareModule {

    private scannedDevices: MiFloraDevice[] = [];

    constructor(private readonly miflorableModule: MiFloraModule, private readonly httpModule: HttpModule) { }

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

    postSampleData(data: SensorSample): Effect<never, HttpError, void> {
        return tryPromise({
            try: () => this.httpModule.post(data),
            catch: (err) => {
                return {
                    _tag: 'httpError',
                    message: toError(err).message
                };
            }
        });
    }

    private discover(macAddress: string): Effect<never, DiscoverError, MiFloraDevice[]> {
        if (this.scannedDevices.length >= 1 && this.scannedDevices[0].address === macAddress) {
            console.log('Device already scanned, returning cached device...');
            return succeed(this.scannedDevices);
        }

        const opts = {
            duration: 5000,
            ignoreUnknown: true,
            clearDevices: true,
            addresses: [macAddress]
        };
        return tryPromise({
            try: async () => {
                this.scannedDevices = await this.miflorableModule.discover(opts)
                return this.scannedDevices;
            },
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
