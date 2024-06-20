import { Injectable, inject } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { switchMap, catchError, of, map } from "rxjs";
import { loadSamples, loadSamplesApi } from "./samples.actions";
import { AllReadingsBetweenGQL } from "@flower-care/libs/dgraph-database-angular";
import { Samples, SamplesAdapter } from "../adapters/samples-adapter";

@Injectable()
export class SamplesEffects {
  private readonly actions$ = inject(Actions);
  private readonly allReadingsBetweenGQL = inject(AllReadingsBetweenGQL);
  private readonly samplesAdapter = inject(SamplesAdapter);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSamples.load),
      switchMap(() => this.fetchSamples()),
      catchError((error) => of(loadSamplesApi.loadFailure({ error }))
      ),
    ),
  );

  private fetchSamples() {
    return this.allReadingsBetweenGQL
      .fetch({ min: "2023-11-05", max: "2023-12-01" })
      .pipe(
        map((queryData) => this.samplesAdapter.adapt(queryData.data)),
        map((samples) => this.reduceSamples(samples)),
        map((samples) => loadSamplesApi.loadSuccess({ samples })),
      );
  }

  private reduceSamples(samples: Samples): Samples {
    const intervalSeconds = 60 * 60 * 3 * 1000; // 3 hours

    // filter samples to only include those that have a intervalSeconds difference
    // between them

    let previousValidSample = samples.timestamp[0];

    const filteredTimestamps = samples.timestamp.filter((sample, index) => {
      if (index === 0) {
        return true;
      }

      if (Math.abs(sample - previousValidSample) > intervalSeconds) {
        previousValidSample = sample;
        return true;
      }

      return false;
    });

    // get the index of the filtered timestamps in the original samples
    const filteredTimestampsIndex = filteredTimestamps.map((sample) =>
      samples.timestamp.indexOf(sample)
    );

    // get the filtered samples

    return {
      temperature: filteredTimestampsIndex.map((index) =>
        samples.temperature[index]
      ),
      moisture: filteredTimestampsIndex.map((index) =>
        samples.moisture[index]
      ),
      fertility: filteredTimestampsIndex.map((index) =>
        samples.fertility[index]
      ),
      light: filteredTimestampsIndex.map((index) =>
        samples.light[index]
      ),
      battery: filteredTimestampsIndex.map((index) =>
        samples.battery[index]
      ),
      timestamp: filteredTimestamps,
      timestampLabels: filteredTimestampsIndex.map((index) =>
        samples.timestampLabels[index]
      ),
    }
  }
}
