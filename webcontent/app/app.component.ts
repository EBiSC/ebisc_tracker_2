import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ApiExamService } from './core/services/api-exam.service';
import { RouteDateService } from './core/services/route-date.service';

const bodyBackgroundStyles: string = `
  :host(.history-mode) {
    background-color: #FFFFE0;
  }
`

@Component({
    selector: 'body',
    styles: [ bodyBackgroundStyles ],
    host: {"[class.history-mode]": "historyModeEnabled"},
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy{

  historyModeEnabled: boolean = false;

  // private properties
  private routeDateSubscription: Subscription = null;
  private currentDate: string;
  private latestDate: string;

  constructor(
    private apiExamService: ApiExamService,
    private routeDateService: RouteDateService,
  ) {};

  ngOnInit() {
    this.apiExamService.getLatestExam().subscribe((exam: {date: string}) => {
      this.latestDate = exam.date;
      this.changeMode();
    });

    this.routeDateService.date$.subscribe((date:string) => {
      this.currentDate = date;
      this.changeMode();
    });
  }

  changeMode() {
    if (this.latestDate && this.currentDate && this.latestDate != this.currentDate) {
      this.historyModeEnabled = true;
    }
    else {
      this.historyModeEnabled = false;
    }
  }

  ngOnDestroy() {
    if (this.routeDateSubscription) {
      this.routeDateSubscription.unsubscribe();
    }
  }

};
