import { createFeatureSelector, createSelector } from "@ngrx/store";
import {
  SAMPLES_FEATURE_KEY,
  SamplesState,
} from "./samples.reducer";

// Lookup the 'Samples' feature state managed by NgRx
export const selectSamplesState =
  createFeatureSelector<SamplesState>(SAMPLES_FEATURE_KEY);

export const selectSamplesLoaded = createSelector(
  selectSamplesState,
  (state: SamplesState) => state.loaded,
);

export const selectSamplesError = createSelector(
  selectSamplesState,
  (state: SamplesState) => state.error,
);

export const selectAllSamples = createSelector(
  selectSamplesState,
  (state: SamplesState) => state.data,
);
