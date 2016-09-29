import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { ActivatedRoute } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiFailsService } from '../core/services/api-fails.service';
import { RouteDateService } from '../core/services/route-date.service';
import { FailList } from '../shared/fail-list';

@Component({
    templateUrl: './cell-line-detail.component.html',
})
export class CellLineDetailComponent implements OnInit, OnDestroy {

  // public properties
  date: string = null;
  cellLine: string = null;
  failList: FailList;
  failsOffset: number = 0;

  // private properties
  private dateSubscription: Subscription = null;
  private failListSource: ReplaySubject<Observable<FailList>>;
  private failListSubscription: Subscription = null;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private routeDateService: RouteDateService,
    private apiFailsService: ApiFailsService,
  ){ 
    this.failListSource =
        new ReplaySubject<Observable<FailList>>(1);
  };

  ngOnInit() {

    this.failListSubscription = this.failListSource
        .switchMap((o: Observable<FailList>):Observable<FailList> => o)
        .subscribe((f:FailList) => this.failList = f );

    this.dateSubscription =
      this.routeDateService.date$.subscribe((date:string) => {
         this.cellLine = this.activatedRoute.snapshot.params['cellLine'];
         this.date = date 
         this.getLineFailList();
      });
  };

  ngOnDestroy() {
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
    if (this.failListSubscription) {
      this.failListSubscription.unsubscribe();
    }
  }

  getLineFailList() {
    if (this.date && this.cellLine) {
      this.failListSource.next(this.apiFailsService
        .search(this.date, {cell_line: this.cellLine, offset: this.failsOffset}));
    }
    else {
      this.failListSource.next(Observable.empty<FailList>());
    }
  }

  tableNext() {
    if (this.tableHasMore()) {
      this.failsOffset += this.failList.pageLimit;
      this.getLineFailList();
    }
  }
  tablePrevious() {
    if (this.failList && this.failList.items) {
      this.failsOffset = (this.failsOffset >= this.failList.pageLimit) ? this.failsOffset - this.failList.pageLimit : 0;
      this.getLineFailList();
    }
  }
  tableHasMore():boolean {
    if (this.failList && this.failList.total > this.failsOffset + this.failList.pageLimit) {
      return true;
    }
    return false;
  }
};
