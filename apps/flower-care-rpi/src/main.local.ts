import { Effect, Layer } from "effect"
import { program } from "./modules/main.module";
import { MiFloraModuleTest } from "./modules/miflora-test.module";
import { FlowerCareModuleLive } from "./modules/flower-care.module";
import { HttpModuleLive } from "./modules/http-netlify.module";


(async () => {
    // Collect dependencies
    const MainTest = Layer.provide(
        Layer.merge(MiFloraModuleTest, HttpModuleLive),
        FlowerCareModuleLive)

    // Make the program runnable by providing the dependencies
    const runnable = Effect.provide(program, MainTest)

    // Run the program
    await Effect.runPromise(runnable);
})();
