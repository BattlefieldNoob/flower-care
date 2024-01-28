import { createReducer, on, Action } from "@ngrx/store";
import { Samples } from "../adapters/samples-adapter";
import { loadSamples, loadSamplesApi } from "./samples.actions";

export const SAMPLES_FEATURE_KEY = "samples";

export interface SamplesState {
  data: Samples;
  loaded: boolean;
  error?: string | null;
}

export interface SamplesPartialState {
  readonly [SAMPLES_FEATURE_KEY]: SamplesState;
}

export const initialSamplesState: SamplesState = {
  data: {
    temperature: [],
    fertility: [],
    light: [],
    moisture: [],
    timestamp: [],
    timestampLabels: [],
    battery: []
  },
  loaded: false
};

const reducer = createReducer(
  initialSamplesState,
  on(loadSamples.load, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(loadSamplesApi.loadSuccess, (state, { samples }) => ({
    ...state,
    error: null,
    loaded: true,
    data: samples
  })),
  on(loadSamplesApi.loadFailure, (state, { error }) => ({
    ...state,
    error,
    loaded: true,
  })),
);

export function samplesReducer(
  state: SamplesState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
