import { Effect, pipe } from "effect";
import { SensorData } from "../models/sensor-data-query-result.type";

const baseUrl = "https://hungry-lewin-8de986.netlify.app/";
const path = ".netlify/functions/readings-create";


const copyWithTimestamp = (data: SensorData) => {
    const ts = new Date().toISOString();
    return { ...data, ts };
}

export const netlifyFunctionClient = (data: SensorData) => pipe(
    Effect.tryPromise({
        try: () => fetch(`${baseUrl}/${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(copyWithTimestamp(data))
        }),
        catch: (error) => {
            return error
        }
    }),
    Effect.flatMap((response) => {
        return pipe(
            Effect.tryPromise({
                try: () => response.json(),
                catch: (error) => {
                    return error
                }
            }),
            Effect.flatMap((parsedJson) => {
                if (response.ok) {
                    return Effect.succeed(parsedJson)
                } else {
                    return Effect.fail(new Error(parsedJson))
                }
            }),
            Effect.tapError((error) => Effect.logError(`Error while parsing response: ${error}`))
        );
    })
);
