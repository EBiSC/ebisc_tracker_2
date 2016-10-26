import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouteDateService } from '../services/route-date.service';

@Component({ 
    templateUrl: './date.component.html',
})
export class DateComponent implements OnInit, OnDestroy{
  
  // public properties
  resolvedDate: string;

  // private properties
  private routeDataSubscription: Subscription = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routeDateService: RouteDateService,
  ){ };

  ngOnInit() {
    this.routeDataSubscription =
      this.activatedRoute.data.subscribe(data => {
        this.resolvedDate = data["date"]
        this.routeDateService.nextDate(this.resolvedDate)
      });
  }

  ngOnDestroy() {
    if (this.routeDataSubscription) {
      this.routeDataSubscription.unsubscribe();
    }
  }

};
