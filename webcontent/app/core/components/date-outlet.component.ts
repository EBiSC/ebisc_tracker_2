import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouteDateService } from '../services/route-date.service';
import { ApiExamService } from '../services/api-exam.service';

@Component({ 
    template: '',
})
export class DateOutletComponent implements OnInit, OnDestroy{
  
  // private properties
  private routeSubscription: Subscription = null;
  date: string;
  latestDate: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routeDateService: RouteDateService,
    private apiExamService: ApiExamService,
  ){ };

  ngOnInit() {
    this.apiExamService.getLatestExam().subscribe((exam: {date: string}) => {
      this.latestDate = exam.date;
      this.setDates();
    });
    this.routeSubscription =
      this.activatedRoute.params.subscribe((params: {date: string}) => {
        this.date = params.date;
        this.setDates();
      });
  }

  setDates() {
    if (this.date) {
      if (this.latestDate && this.latestDate == this.date) {
        let urlTree = this.router.createUrlTree([{outlets:{date:null}}]);
        this.router.navigateByUrl(urlTree, {relativeTo: this.activatedRoute});
      }
      else {
        this.routeDateService.nextDate(this.date)
      }
    }
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

};
