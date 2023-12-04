import { Context, Layer } from 'effect';
import * as miflora from 'miflora';

export interface DiscoverOpt {
    duration: number;
    ignoreUnknown: boolean;
    addresses: string[];
}

export interface MiFloraModule {
    discover(opt: DiscoverOpt): Promise<miflora.MiFloraDevice[]>;
    connect(device: miflora.MiFloraDevice): Promise<miflora.MiFloraDevice>;
    disconnect(device: miflora.MiFloraDevice): Promise<void>;
    querySerial(device: miflora.MiFloraDevice): Promise<miflora.DeviceSerialQueryResult>;
    query(device: miflora.MiFloraDevice): Promise<miflora.SensorDataQueryResult>;
}

export const MiFloraModule = Context.Tag<MiFloraModule>();

class MifloraBleModule implements MiFloraModule {
    async discover(opt: DiscoverOpt): Promise<miflora.MiFloraDevice[]> {
        return await miflora.discover(opt);
    }

    async connect(device: miflora.MiFloraDevice): Promise<miflora.MiFloraDevice> {
        return await device.connect();
    };

    async disconnect(device: miflora.MiFloraDevice): Promise<void> {
        return await device.disconnect();
    }
    async querySerial(device: miflora.MiFloraDevice): Promise<miflora.DeviceSerialQueryResult> {
        return await device.querySerial();
    }
    async query(device: miflora.MiFloraDevice): Promise<miflora.SensorDataQueryResult> {
        return await device.query();
    }
}

export type MiFloraDevice = miflora.MiFloraDevice;

export const MiFloraModuleLive = Layer.succeed(
    MiFloraModule,
    MiFloraModule.of(new MifloraBleModule())
)

export const MiFloraModuleTest = Layer.succeed(
    MiFloraModule,
    MiFloraModule.of({
        discover: function (): Promise<miflora.MiFloraDevice[]> {
            return Promise.resolve([]);
        },
        connect: function (): Promise<miflora.MiFloraDevice> {
            throw new Error('Function not implemented.');
        },
        disconnect: function (): Promise<void> {
            throw new Error('Function not implemented.');
        },
        querySerial: function (): Promise<miflora.DeviceSerialQueryResult> {
            throw new Error('Function not implemented.');
        },
        query: function (): Promise<miflora.SensorDataQueryResult> {
            throw new Error('Function not implemented.');
        }
    })
)
