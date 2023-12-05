import { Layer } from 'effect';
import * as miflora from 'miflora';
import { DiscoverOpt, MiFloraModule as MiFlora, MiFloraModule } from '../models/miflora-module.interface';
import { DeviceSerialQueryResult } from '../models/device-serial-query-result.type';
import { SensorDataQueryResult } from '../models/sensor-data-query-result.type';
import { MiFloraDevice } from '../models/miflora-device.interface';

class MifloraBleModule implements MiFlora {
    async discover(opt: DiscoverOpt): Promise<MiFloraDevice[]> {
        return await miflora.discover(opt);
    }

    async connect(device: MiFloraDevice): Promise<MiFloraDevice> {
        return await device.connect();
    };

    async disconnect(device: MiFloraDevice): Promise<void> {
        return await device.disconnect();
    }
    async querySerial(device: MiFloraDevice): Promise<DeviceSerialQueryResult> {
        return await device.querySerial();
    }
    async query(device: MiFloraDevice): Promise<SensorDataQueryResult> {
        return await device.query();
    }
}

export const MiFloraModuleLive = Layer.succeed(
    MiFloraModule,
    MiFloraModule.of(new MifloraBleModule())
)
