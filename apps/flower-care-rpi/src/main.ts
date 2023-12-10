import { Effect, Layer, Schedule, pipe } from "effect"
import { FlowerCareModule, FlowerCareModuleLive } from "./modules/flower-care.module";
import { Do, bind } from "effect/Effect";
import { MiFloraModuleLive } from "./modules/miflora-ble.module";

console.log('Hello World');

const flowerCareMacAddress = 'C4:7C:8D:6C:D5:1D';

(async () => {
    const retryPolicy = Schedule.addDelay(
        Schedule.recurs(2), // Retry for a maximum of 2 times
        () => "300 millis" // Add a delay of 300 milliseconds between retries
    )

    // Run the code every 30 minutes
    const schedule = Schedule.fixed("30 minutes")


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
        Effect.tap(({ data, serial }) => {
            return Effect.logInfo(`Serial: ${JSON.stringify(serial)}`)
                .pipe(Effect.flatMap(() => Effect.logInfo(`Data: ${JSON.stringify(data)}`)))
        }))


    const MainLive = MiFloraModuleLive.pipe(
        Layer.provide(FlowerCareModuleLive)
    )

    const runnable = Effect.provide(program, MainLive)

    const retryableRunnable = Effect.retry(
        Effect.log('Executing try of runnable...')
            .pipe(
                Effect.flatMap(() => runnable),
                Effect.mapError(error => {
                    console.error('Error after retries:', error);
                    return error
                })
            ),
        retryPolicy)

    const scheduledRunnable = Effect.schedule(
        Effect.log('Executing scheduled runnable...')
            .pipe(Effect.flatMap(() => retryableRunnable)),
        schedule)

    await Effect.runPromise(
        Effect.log('Starting complete runnable...')
            .pipe(
                Effect.flatMap(() => retryableRunnable), // First run without delay
                Effect.flatMap(() => scheduledRunnable) // Then run with delay and schedule
            )
    );
})();
