import { Effect, pipe } from "effect"
import { Do, bind } from "effect/Effect";
import { FlowerCareModule } from "./modules/flower-care.module";


console.log('Hello World');


(async () => {
    const runProgram = () => {
        const flowerCareMacAddress = 'C4:7C:8D:6C:D5:1D';

        const flowerCare = new FlowerCareModule();
        const connectAndGetData = pipe(
            Do,
            bind('device', () => flowerCare.discoverAndConnect(flowerCareMacAddress.toLowerCase())),
            bind('serial', ({ device }) => flowerCare.executeDeviceSerialQuery(device)),
            bind('data', ({ device }) => flowerCare.executeSensorDataQuery(device)),
        );
        
        const program = pipe(
            connectAndGetData,
            Effect.tap(({ device }) => {
                console.log('Disconnecting from device...');
                return flowerCare.disconnect(device);
            }),
            Effect.map(({ data, serial }) => {
                console.log('Serial:', serial);
                console.log('Data:', data);
                return { serial, data }
            })
        );
        
        Effect.runSync(program);
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
