import { Layer } from "effect";
import { HttpModule } from "../models/http-module.interface";

export const HttpModuleTest = Layer.succeed(
    HttpModule,
    HttpModule.of({
        post: async (body: object) => {
            console.log('Mock post to netlify function', body);
            return Promise.resolve({});
        }
    })
)
