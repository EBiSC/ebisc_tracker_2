import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ApiExamService } from '../services/api-exam.service';
import { RouteDateService } from '../services/route-date.service';

@Component({
    selector: 'history-warning',
    templateUrl: './history-warning.component.html',
})
export class HistoryWarningComponent implements OnInit, OnDestroy{

  // public properties
  currentDate: string;
  latestDate: string;
  showWarning: boolean;

  // private properties
  private routeSubscription: Subscription = null;

  constructor(
    private apiExamService: ApiExamService,
    private routeDateService: RouteDateService,
    private router: Router,
  ){};

  ngOnInit() {
    this.routeSubscription =
      this.routeDateService.resolvedDate$.subscribe((date: string) => {
        if (date !== this.currentDate) {
          this.currentDate = date;
          this.setWarning();
        }
      });
    this.apiExamService.getLatestExam().subscribe((exam: {date: string}) => {
      this.latestDate = exam.date;
      this.setWarning();
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  setWarning() {
    if (this.currentDate && this.latestDate && (this.currentDate !== this.latestDate)) {
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
    this.router.navigate([{date: 'latest'}]);
  }

}
