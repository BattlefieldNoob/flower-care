import { Injectable, inject } from "@angular/core";
import { select, Store } from "@ngrx/store";
import * as SamplesSelectors from "./samples.selectors";
import { loadSamples } from "./samples.actions";
import { map } from "rxjs";

@Injectable()
export class SamplesFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(SamplesSelectors.selectSamplesLoaded));
  allSamples$ = this.store.pipe(
    select(SamplesSelectors.selectAllSamples),
    map((samples) => {
      return samples;
    }));

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  load(filters: string) {
    this.store.dispatch(loadSamples.load({ filter: filters }));
  }
}
