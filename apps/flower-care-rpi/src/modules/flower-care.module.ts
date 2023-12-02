import { Effect, Either } from 'effect';
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

export class FlowerCareModule {

    // $ExpectType Effect<never, Error, Response>
    const program = Effect.tryPromise({
        try: () => fetch("https://jsonplaceholder.typicode.com/todos/1"),
        catch: (unknown) => {
            
        } // remap the error
    })

    private discover(macAddress: string) {
        const opts = {
            duration: 5000,
            ignoreUnknown: true,
            addresses: [macAddress]
        };
        return pipe(
            Effect.tryPromise({
                try: () => miflora.discover(macAddress)
            }),
            m
        )
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
                    _tag: 'discoverError',
                    macAddress: macAddress,
                    message: err.message
                };
            })
        );
    }
}

// export class FlowerCareModule {

//     discoverAndConnect(macAddress: string): TaskEither<DiscoverError | ConnectError, miflora.MiFloraDevice> {
//         return pipe(
//             this.discover(macAddress),
//             flatMap((devices) => this.validateDevices(devices, macAddress)),
//             flatMap((device) => pipe(
//                 this.connect(device),
//                 flatMap(() => of(device))
//             ))
//         );
//     }

//     executeDeviceSerialQuery(device: miflora.MiFloraDevice): TaskEither<QueryError, DeviceSerialQueryResult> {
//         return pipe(
//             tryCatch(() =>
//                 device.querySerial() as Promise<DeviceSerialQueryResult>,
//                 toError),
//             mapLeft((err) => {
//                 return {
//                     _tag: 'queryError',
//                     macAddress: device.address,
//                     message: err.message
//                 };
//             }))
//     }

//     executeSensorDataQuery(device: miflora.MiFloraDevice): TaskEither<QueryError, SensorDataQueryResult> {
//         return pipe(
//             tryCatch(() =>
//                 device.query() as Promise<SensorDataQueryResult>,
//                 toError),
//             mapLeft((err) => {
//                 return {
//                     _tag: 'queryError',
//                     macAddress: device.address,
//                     message: err.message
//                 };
//             }))
//     }

//     disconnect(device: miflora.MiFloraDevice): TaskEither<DisconnectError, void> {
//         return pipe(
//             tryCatch(() =>
//                 device.disconnect() as Promise<void>,
//                 toError),
//             mapLeft((err) => {
//                 return {
//                     _tag: 'disconnectError',
//                     macAddress: device.address,
//                     message: err.message
//                 };
//             }))
//     }

//     private validateDevices(devices: miflora.MiFloraDevice[], macAddress: string): TaskEither<DiscoverError, miflora.MiFloraDevice> {
//         if (devices.length > 0)
//             return of(devices[0]);
//         else
//             return left({
//                 _tag: 'discoverError',
//                 macAddress: macAddress,
//                 message: 'Device not found'
//             });
//     }

//     private discover(macAddress: string): TaskEither<DiscoverError, miflora.MiFloraDevice[]> {
//         const opts = {
//             duration: 5000,
//             ignoreUnknown: true,
//             addresses: [macAddress]
//         };
//         return pipe(
//             tryCatch(
//                 () => miflora.discover(opts) as Promise<miflora.MiFloraDevice[]>,
//                 toError),
//             mapLeft((err) => {
//                 return {
//                     _tag: 'discoverError',
//                     macAddress: macAddress,
//                     message: err.message
//                 };
//             })
//         );
//     }

//     private connect(device: miflora.MiFlora): TaskEither<ConnectError, void> {
//         return pipe(
//             tryCatch(
//                 () => device.connect() as Promise<void>,
//                 toError),
//             mapLeft((err) => {
//                 return {
//                     _tag: 'connectError',
//                     macAddress: device.address,
//                     message: err.message
//                 };
//             }));
//     }
// }
