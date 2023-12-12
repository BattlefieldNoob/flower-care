import { Config, Duration, Effect, Schedule, pipe } from "effect"
import { FlowerCareModule, FlowerCareModuleLive } from "./modules/flower-care.module";
import { Do, bind, flatMap, log, logInfo, mapError, provide, retry, runPromise, tap } from "effect/Effect";
import { MiFloraModuleLive } from "./modules/miflora-ble.module";
import { netlifyFunctionClient } from "./modules/netlify-function-client";

console.log('Hello World');

const flowerCareMacAddress = 'C4:7C:8D:6C:D5:1D';

(async () => {
    const retryPolicy = Schedule.addDelay(
        Schedule.recurs(2), // Retry for a maximum of 2 times
        () => "300 millis" // Add a delay of 300 milliseconds between retries
    )
    
    const program = FlowerCareModule.pipe(
        flatMap((flowerCare) => {
            return pipe(
                Do,
                bind('device', () => flowerCare.discoverAndConnect(flowerCareMacAddress.toLowerCase())),
                bind('serial', ({ device }) => flowerCare.executeDeviceSerialQuery(device)),
                bind('data', ({ device }) => flowerCare.executeSensorDataQuery(device)),
                bind('_', ({ device }) => flowerCare.disconnect(device)),
            )
        }),
        tap(({ data, serial }) => {
            return logInfo(`Serial: ${JSON.stringify(serial)}`)
                .pipe(flatMap(() => logInfo(`Data: ${JSON.stringify(data)}`)))
        }),
        flatMap(({ data }) => netlifyFunctionClient(data.sensorValues)),
        tap(() => logInfo(`Successfully sent data to the server`))
    )

    const runnable = provide(
        provide(program, FlowerCareModuleLive),
        MiFloraModuleLive)

    const retryableRunnable = retry(
        log('Executing try of runnable...')
            .pipe(
                flatMap(() => runnable),
                mapError(error => {
                    console.error('Error after retries:', error);
                    return error
                })
            ),
        retryPolicy)

    const scheduledRunnable = pipe(
        Effect.config(Config.withDefault(Config.string("SAMPLE_INTERVAL"), "30 minutes")),
        Effect.tap((config) => log(`Configuring runnable with interval ${config}...`)),
        Effect.map((config) => Schedule.fixed(config as Duration.DurationInput)),
        Effect.flatMap((interval) => {
            return Effect.schedule(retryableRunnable, interval);
        }))

    await runPromise(
        log('Starting complete runnable...')
            .pipe(
                flatMap(() => retryableRunnable), // First run without delay
                flatMap(() => scheduledRunnable) // Then run with delay and schedule
            )
    );
})();
