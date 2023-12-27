import { Config, Duration, Effect, Layer, Schedule, pipe } from "effect"
import { FlowerCareModuleLive } from "./modules/flower-care.module";
import { flatMap, log, mapError, provide, retry, runPromise } from "effect/Effect";
import { MiFloraModuleLive } from "./modules/miflora-ble.module";
import { program } from "./modules/main.module";
import { HttpModuleLive } from "./modules/http-netlify.module";

console.log('Hello World');

(async () => {
    const retryPolicy = Schedule.addDelay(
        Schedule.recurs(2), // Retry for a maximum of 2 times
        () => "300 millis" // Add a delay of 300 milliseconds between retries
    )

    // Collect dependencies
    const MainLive = Layer.provide(
        FlowerCareModuleLive,
        Layer.merge(MiFloraModuleLive, HttpModuleLive)
    )

    const runnable = provide(program, MainLive)

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
        Config.withDefault(Config.string("SAMPLE_INTERVAL"), "30 minutes"),
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
