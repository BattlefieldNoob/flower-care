import { Context } from "effect";

export interface HttpModule {
    post(body: object): Promise<unknown>;
}

export const HttpModule = Context.Tag<HttpModule>();
