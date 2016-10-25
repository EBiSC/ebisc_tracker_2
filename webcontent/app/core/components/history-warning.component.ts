import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ApiExamService } from '../services/api-exam.service';
import { RouteDateService } from '../services/route-date.service';
import { HistoryModeEnabledService } from '../services/history-mode-enabled.service';

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
  private historyEnabledSubscription: Subscription = null;

  constructor(
    private apiExamService: ApiExamService,
    private routeDateService: RouteDateService,
    private historyModeEnabledService: HistoryModeEnabledService,
    private router: Router,
  ){};

  ngOnInit() {
    this.routeSubscription =
      this.routeDateService.resolvedDate$.subscribe((date: string) => this.currentDate = date);

    this.apiExamService.getLatestExam().subscribe((exam: {date: string}) => this.latestDate = exam.date);

    this.historyEnabledSubscription = this.historyModeEnabledService.enabled$
      .subscribe((enabled: boolean) => this.showWarning = enabled);

  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.historyEnabledSubscription) {
      this.historyEnabledSubscription.unsubscribe();
    }
  }

  dismiss() {
    this.showWarning = false;
  }

  exitHistoryMode() {
    this.router.navigate([{date: 'latest'}], {relativeTo: this.routeDateService.getBottomActivatedRoute()});
  }

}
