import { createActionGroup, props } from "@ngrx/store";
import { Samples } from "../adapters/samples-adapter";

export const loadSamples = createActionGroup({
  source: 'Samples',
  events: {
    'Load': props<{ filter: string }>(),
  },
});

export const loadSamplesApi = createActionGroup({
  source: 'Samples/API',
  events: {
    'Load Success': props<{ samples: Samples }>(),
    'Load Failure': props<{ error: string }>(),
  },
});
