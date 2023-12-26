import { Layer } from "effect";
import { HttpModule } from "../models/http-module.interface";


const baseUrl = "https://hungry-lewin-8de986.netlify.app";
const path = ".netlify/functions/readings-create";

export class HttpNetlifyModuleImpl implements HttpModule {
    async post(body: object): Promise<unknown> {
        const response = await fetch(`${baseUrl}/${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        return await response.json();
    }
}

export const HttpModuleLive = Layer.succeed(
    HttpModule,
    HttpModule.of(new HttpNetlifyModuleImpl())
)
