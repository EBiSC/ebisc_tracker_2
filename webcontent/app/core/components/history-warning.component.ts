import { Component, OnChanges, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ApiExamService } from '../services/api-exam.service';

@Component({
    selector: 'history-warning',
    templateUrl: './history-warning.component.html',
})
export class HistoryWarningComponent implements OnChanges, OnDestroy{
  @Input() currentDate: string;

  // public properties
  latestDate: string;
  showWarning: boolean;

  // private properties
  private subscription: Subscription = null;

  constructor(
    private apiExamService: ApiExamService,
    private router: Router,
  ){};

  ngOnChanges(changes: SimpleChanges) {
    if (! this.subscription) {
      this.subscription =
        this.apiExamService.getLatestExam().subscribe((exam: {date: string}) => {
          this.latestDate = exam.date;
          this.changeMode();
        });
    }
    this.changeMode();
  }

  changeMode() {
    if (this.latestDate && this.currentDate && this.latestDate != this.currentDate) {
      this.showWarning = true;
    }
    else {
      this.showWarning = false;
    }
  }

  dismiss() {
    this.showWarning = false;
  }

  exitHistoryMode() {
    this.router.navigate([{}]);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
