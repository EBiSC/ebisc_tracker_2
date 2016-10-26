import { Component, OnInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ApiExamService } from '../services/api-exam.service';
import { RouteDateService } from '../services/route-date.service';

@Component({
    selector: 'history-warning',
    templateUrl: './history-warning.component.html',
})
export class HistoryWarningComponent implements OnInit, OnDestroy{

  // public properties
  latestDate: string;
  currentDate: string;
  showWarning: boolean;

  // private properties
  private latestDateSubscription: Subscription = null;
  private currentDateSubscription: Subscription = null;

  constructor(
    private apiExamService: ApiExamService,
    private routeDateService: RouteDateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ){};

  ngOnInit() {
    this.latestDateSubscription =
      this.apiExamService.getLatestExam().subscribe((exam: {date: string}) => {
        this.latestDate = exam.date;
        this.changeMode();
      });
    this.currentDateSubscription = 
      this.routeDateService.date$.subscribe((date:string) => {
          this.currentDate = date;
          this.changeMode();
      });
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

  leaveHistoryMode() {
    let urlTree = this.router.createUrlTree([{outlets:{date:null}}]);
    this.router.navigateByUrl(urlTree, {relativeTo: this.activatedRoute});
  }

  ngOnDestroy() {
    if (this.currentDateSubscription) {
      this.currentDateSubscription.unsubscribe();
    }
    if (this.latestDateSubscription) {
      this.latestDateSubscription.unsubscribe();
    }
  }

}
