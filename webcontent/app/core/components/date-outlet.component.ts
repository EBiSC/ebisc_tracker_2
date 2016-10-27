import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouteDateService } from '../services/route-date.service';

@Component({ 
    template: '',
})
export class DateOutletComponent implements OnInit, OnDestroy{
  
  // private properties
  private routeSubscription: Subscription = null;
  private isLatestSubscription: Subscription = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routeDateService: RouteDateService,
  ){ };

  ngOnInit() {
    this.routeSubscription =
      this.activatedRoute.params.subscribe((params: {date: string}) => {
        this.routeDateService.nextDate(params.date);
      });
    this.isLatestSubscription =
      this.routeDateService.isLatest$.subscribe((isLatest: boolean) => {
        if (isLatest) {
          let urlTree = this.router.createUrlTree([{outlets:{date:null}}]);
          this.router.navigateByUrl(urlTree, {relativeTo: this.activatedRoute});
        }
      });
  }

  ngOnDestroy() {
    this.routeDateService.nextDate(null);
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.isLatestSubscription) {
      this.isLatestSubscription.unsubscribe();
    }
  }

};
