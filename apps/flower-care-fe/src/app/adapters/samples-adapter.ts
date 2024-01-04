import { Injectable } from '@angular/core';
import { AllReadingsBetweenQuery, Readings } from '../generated/graphql';
import { ModelAdapter } from './model-adapter';

export interface Sample {
    timestamp: string;
    value: number;
}

export interface Samples {
    temperature: number[];
    moisture: number[];
    light: number[];
    fertility: number[];
    battery: number[];
    timestamp: number[];
    timestampLabels: string[];
}

@Injectable({
    providedIn: 'root'
})
export class SamplesAdapter implements ModelAdapter<AllReadingsBetweenQuery, Samples> {
    adapt(input: AllReadingsBetweenQuery): Samples {

        const rawSamples = (input.queryReadings ?? []).flatMap((r) => r ? [r] : []);

        return {
            temperature: rawSamples.map((sample) => sample.temperature),
            moisture: rawSamples.map((sample) => sample.moisture),
            light: rawSamples.map((sample) => sample.sunlight),
            fertility: rawSamples.map((sample) => sample.fertility),
            battery: rawSamples.map((sample) => sample.battery),
            timestamp: rawSamples.map((sample) => this.adaptTimestamp(sample.ts)),
            timestampLabels: rawSamples.
                map((sample) => this.adaptTimestampFormatted(sample.ts)),
        };
    }

    private adaptTimestamp(timestamp: unknown): number {
        if (typeof timestamp === 'string') {
            return new Date(timestamp).getTime();
        }
        throw new Error(`Cannot adapt timestamp ${timestamp}`);
    }

    private adaptTimestampFormatted(timestamp: unknown): string {
        if (typeof timestamp === 'string') {
            // assume timestamp formated is in ISO format
            // format it to a more readable format
            const date = new Date(timestamp);
            return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}-${date.getHours()}`;
        }
        throw new Error(`Cannot adapt timestamp ${timestamp}`);
    }
}
