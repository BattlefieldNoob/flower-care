import { Effect, Layer, pipe } from "effect"
import { Do, bind } from "effect/Effect";
import { FlowerCareModule, FlowerCareModuleLive } from "./modules/flower-care.module";
import { MiFloraModuleTest } from "./modules/miflora-ble.module";


console.log('Hello World');


(async () => {
    const runProgram = () => {
        const flowerCareMacAddress = 'C4:7C:8D:6C:D5:1D';

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

        const MainLive = MiFloraModuleTest.pipe(
            Layer.provide(FlowerCareModuleLive)
        )

        const runnable = Effect.provide(program, MainLive)

        Effect.runSync(runnable);
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
