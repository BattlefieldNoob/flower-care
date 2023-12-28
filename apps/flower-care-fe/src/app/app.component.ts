import { Component, OnInit, inject } from '@angular/core';
import { AllReadingsBetweenGQL } from './generated/graphql';

@Component({
  selector: 'flower-care-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'flower-care-fe';

  readonly allReadingsBetweenGQL = inject(AllReadingsBetweenGQL);

  ngOnInit(): void {
    this.allReadingsBetweenGQL
      .fetch({ min: "2023-11-01", max: "2023-12-01" })
      .subscribe(console.log);
  }
}
