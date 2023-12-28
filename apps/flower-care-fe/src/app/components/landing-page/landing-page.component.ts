import { Component } from "@angular/core";
import { DropdownChangeEvent } from "primeng/dropdown";

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
    {name: "1 Day", code: "1"},
    {name: "2 Days", code: "2"},
    {name: "5 Days", code: "5"},
    {name: "10 Days", code: "10"},
    {name: "+10 Days", code: "11"},
  ]

  selectedInterval: TimeInterval | undefined;

  changeInterval($event: DropdownChangeEvent) {
    console.log($event.value);
  }
}
