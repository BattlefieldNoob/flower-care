import { Effect, pipe } from "effect";
import { SensorData, SensorDataRequest } from "../models/sensor-data-query-result.type";

const baseUrl = "https://hungry-lewin-8de986.netlify.app";
const path = ".netlify/functions/readings-create";


const generateSensorDataRequest = (data: SensorData): SensorDataRequest => {
    const ts = new Date().toISOString();
    const battery = 46;
    return {
        battery: battery,
        fertility: data.fertility,
        moisture: data.moisture,
        sunlight: data.lux,
        temperature: data.temperature,
        ts
    }
}

export const netlifyFunctionClient = (data: SensorData) => pipe(
    Effect.tryPromise({
        try: () => fetch(`${baseUrl}/${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(generateSensorDataRequest(data))
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
