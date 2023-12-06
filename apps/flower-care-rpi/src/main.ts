import { Effect, Layer, pipe } from "effect"
import { FlowerCareModule, FlowerCareModuleLive } from "./modules/flower-care.module";
import { Do, bind } from "effect/Effect";
import { MiFloraModuleLive } from "./modules/miflora-ble.module";

console.log('Hello World');

const flowerCareMacAddress = 'C4:7C:8D:6C:D5:1D';

(async () => {
    const runProgram = async () => {

        const program = FlowerCareModule.pipe(
            Effect.flatMap((flowerCare) => {
                return pipe(
                    Do,
                    bind('device', () => flowerCare.discoverAndConnect(flowerCareMacAddress.toLowerCase())),
                    bind('serial', ({ device }) => flowerCare.executeDeviceSerialQuery(device)),
                    bind('data', ({ device }) => flowerCare.executeSensorDataQuery(device)),
                    bind('_', ({ device }) => flowerCare.disconnect(device)),
                )
            }),
            Effect.map(({ data, serial }) => {
                console.log('Serial:', serial);
                console.log('Data:', data);
                return { serial, data }
            }))

        const MainLive = MiFloraModuleLive.pipe(
            Layer.provide(FlowerCareModuleLive)
        )

        const runnable = Effect.provide(program, MainLive)

        await Effect.runPromise(runnable);
    }

    // Run the code immediately
    console.log('Starting code...');
    runProgram();

    // Run the code every 30 minutes
    setInterval(() => {
        console.log('Running code...');
        runProgram();
    }, 30 * 60 * 1000);
})();
