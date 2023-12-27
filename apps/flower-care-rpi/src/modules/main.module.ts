import { Effect, Either } from "effect";
import { ConnectError, DisconnectError, DiscoverError, FlowerCareModule, HttpError, QueryError } from "./flower-care.module";
import { queryToSensorSampleMapper } from "../mappers/sensor-query-to-sample.mapper";

const flowerCareMacAddress = 'C4:7C:8D:6C:D5:1D';

// First phase of the application, handle the BLE connection and data retrieval from the device
// Requires MiFloraModule, FlowerCareModule and the BLE Mac Address of the device
// Returns the SensorSample or an Error
const bleAndSendDataProgram: Effect.Effect<
    FlowerCareModule,
    DiscoverError | ConnectError | QueryError | DisconnectError | HttpError,
    void> = Effect.gen(function* (_) {
        const flowerCare = yield* _(FlowerCareModule);
        const macAddress = yield* _(Effect.succeed(flowerCareMacAddress.toLowerCase()));
        const device = yield* _(flowerCare.discoverAndConnect(macAddress));
        //const serial = yield* _(flowerCare.executeDeviceSerialQuery(device));
        //yield* _(Effect.logInfo(`Serial: ${JSON.stringify(serial)}`));
        const data = yield* _(flowerCare.executeSensorDataQuery(device));
        yield* _(flowerCare.disconnect(device));
        const sensorSample = queryToSensorSampleMapper(data);
        yield* _(flowerCare.postSampleData(sensorSample));
    });


// Main Execution Flow of the Application, should never throw an error or return a value
export const program: Effect.Effect<
    FlowerCareModule,
    never,
    void> = Effect.gen(function* (_) {
        const successOfFailure = yield* _(Effect.either(bleAndSendDataProgram));
        yield* _(Effect.logInfo(`Success: ${JSON.stringify(successOfFailure)}`));
        return Either.match(successOfFailure, {
            onLeft: (error) => {
                return Effect.fail(new Error(JSON.stringify(error)));
            },
            onRight: () => {
                return;
            }
        });
    });
