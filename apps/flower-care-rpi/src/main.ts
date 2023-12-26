import { Effect, Layer, Schedule } from "effect"
import { FlowerCareModuleLive } from "./modules/flower-care.module";
import { MiFloraModuleLive } from "./modules/miflora-ble.module";
import { program } from "./modules/main.module";

console.log('Hello World');

(async () => {
    const retryPolicy = Schedule.addDelay(
        Schedule.recurs(2), // Retry for a maximum of 2 times
        () => "300 millis" // Add a delay of 300 milliseconds between retries
    )

    // Run the code every 30 minutes
    const schedule = Schedule.fixed("30 minutes")

    // Collect dependencies
    const MainLive = Layer.provide(MiFloraModuleLive, FlowerCareModuleLive)

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
