import { Component, OnInit, Signal, inject } from "@angular/core";
import { DropdownChangeEvent } from "primeng/dropdown";
import { Samples } from "../../adapters/samples-adapter";
import { map } from "rxjs";
import { toSignal } from '@angular/core/rxjs-interop';
import { SamplesFacade } from "../../+state/samples.facade";

interface TimeInterval {
  name: string;
  code: string;
}

@Component({
  selector: "flower-care-landing-page",
  templateUrl: "./landing-page.component.html",
})
export class LandingPageComponent implements OnInit {
  timeIntervals: TimeInterval[] = [
    { name: "1 Day", code: "1" },
    { name: "2 Days", code: "2" },
    { name: "5 Days", code: "5" },
    { name: "10 Days", code: "10" },
    { name: "+10 Days", code: "11" },
  ]

  selectedInterval: TimeInterval | undefined;

  private readonly samplesFacade = inject(SamplesFacade);
  
  data: Signal<any | undefined> = toSignal(this.samplesFacade.allSamples$.pipe(
    map((samples) => this.plotData(samples))
  ));

  plotData(samples: Samples) {
    return {
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
  }

  changeInterval($event: DropdownChangeEvent) {
    console.log($event.value);
    this.samplesFacade.load($event.value);
  }

  ngOnInit(): void {
    this.samplesFacade.load("1");
  }
}
