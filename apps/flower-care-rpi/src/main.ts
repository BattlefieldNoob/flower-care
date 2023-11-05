import { pipe } from "fp-ts/lib/function";
import { FlowerCareModule } from "./modules/flower-care.module";
import { Do, bind, bindW, mapBoth, tap } from "fp-ts/lib/TaskEither";

console.log('Hello World');

const flowerCareMacAddress = 'C4:7C:8D:66:3A:2C';

const flowerCare = new FlowerCareModule();
const connectAndGetData = pipe(
    Do,
    bind('device', () => flowerCare.discoverAndConnect(flowerCareMacAddress)),
    bindW('serial', ({ device }) => flowerCare.executeDeviceSerialQuery(device)),
    bindW('data', ({ device }) => flowerCare.executeSensorDataQuery(device)),
);


(async () => {
    const runCode = async () => {
        console.log('Running code...');
        const result = await pipe(
            connectAndGetData,
            tap(({ device }) => {
                console.log('Disconnecting from device...');
                return flowerCare.disconnect(device);
            }),
            mapBoth(
                (err) => {
                    console.error(err);
                    return err;
                },
                ({ serial, data }) => {
                    console.log('Serial:', serial);
                    console.log('Data:', data);
                    return { serial, data }
                }
            )
        )();

        console.log('Result:', result);
    }

    // Run the code immediately
    console.log('Starting code...');
    await runCode();

    // Run the code every 30 minutes
    setInterval(() => {
        console.log('Running code...');
        runCode();
    }, 30 * 60 * 1000);
})();
