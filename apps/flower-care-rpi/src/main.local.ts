import { Effect, Layer } from "effect"
import { program } from "./modules/main.module";
import { MiFloraModuleTest } from "./modules/miflora-test.module";
import { FlowerCareModuleLive } from "./modules/flower-care.module";
import { HttpModuleTest } from "./modules/http-test.module";


(async () => {
    // Collect dependencies
    const mainTest = Layer.provide(
        FlowerCareModuleLive,
        Layer.merge(MiFloraModuleTest, HttpModuleTest)
    )

    // Make the program runnable by providing the dependencies
    const runnable = Effect.provide(program, mainTest)

    // Run the program
    await Effect.runPromise(runnable);
})();
