import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouteDateService } from '../services/route-date.service';

@Component({ 
    templateUrl: './date-outlet.component.html',
})
export class DateOutletComponent implements OnInit, OnDestroy{
  
  // public properties
  date: string;

  // private properties
  private routeSubscription: Subscription = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routeDateService: RouteDateService,
  ){ };

  ngOnInit() {
    console.log('date component init');
    this.routeSubscription =
      this.activatedRoute.params.subscribe((params: {date: string}) => {
        console.log('date is', params.date);
        this.date = params.date;
        this.routeDateService.nextDate(this.date)
      });
  }

  ngOnDestroy() {
    console.log('date component destroy');
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

};
