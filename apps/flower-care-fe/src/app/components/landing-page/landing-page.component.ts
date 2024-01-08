import { Component, inject } from "@angular/core";
import { DropdownChangeEvent } from "primeng/dropdown";
import { Samples, SamplesAdapter } from "../../adapters/samples-adapter";
import { map } from "rxjs/operators";
import { AllReadingsBetweenGQL } from "@flower-care/libs/dgraph-database";

interface TimeInterval {
  name: string;
  code: string;
}

@Component({
  selector: "flower-care-landing-page",
  templateUrl: "./landing-page.component.html",
})
export class LandingPageComponent {
  timeIntervals: TimeInterval[] = [
    { name: "1 Day", code: "1" },
    { name: "2 Days", code: "2" },
    { name: "5 Days", code: "5" },
    { name: "10 Days", code: "10" },
    { name: "+10 Days", code: "11" },
  ]

  selectedInterval: TimeInterval | undefined;

  data: unknown;

  readonly allReadingsBetweenGQL = inject(AllReadingsBetweenGQL);

  readonly samplesAdapter = inject(SamplesAdapter);

  plotData(samples: Samples) {
    this.data = {
      labels: samples.timestampLabels,
      datasets: [
        {
          label: 'Temperature',
          data: samples.temperature,
          fill: false,
          tension: 0.4
        },
      ]
    }

    console.log(this.data);
  }

  changeInterval($event: DropdownChangeEvent) {
    console.log($event.value);
    this.allReadingsBetweenGQL
      .fetch({ min: "2023-11-05", max: "2023-12-01" })
      .pipe(
        map((queryData) => this.samplesAdapter.adapt(queryData.data)),
        map((samples) => this.reduceSamples(samples))
      )
      .subscribe(this.plotData.bind(this));
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
