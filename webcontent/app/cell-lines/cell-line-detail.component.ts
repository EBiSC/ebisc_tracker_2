import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { ActivatedRoute } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
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
  date: string
  cellLine: string
  failList: FailList;
  failsOffset: number

  // private properties
  private routeSubscription: Subscription = null;
  private dateSubscription: Subscription = null;
  private failListSource: Subject<Observable<FailList>>;
  private failListSubscription: Subscription = null;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiFailsService: ApiFailsService,
    private routeDateService: RouteDateService,
  ){ };

  ngOnInit() {
    this.failListSource = new Subject<Observable<FailList>>();

    this.failListSubscription = this.failListSource
        .switchMap((o: Observable<FailList>):Observable<FailList> => o)
        .subscribe((f:FailList) => this.failList = f );

    this.routeSubscription =
      this.activatedRoute.params.subscribe((params: {cellLine: string}) => {
        this.cellLine = params.cellLine;
        this.failsOffset = 0;
        this.getLineFailList();
      });
    this.dateSubscription =
      this.routeDateService.date$.subscribe((date: string) => {
        this.date = date;
        this.failsOffset = 0;
        this.getLineFailList();
      });
  };

  ngOnDestroy() {
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.failListSubscription) {
      this.failListSubscription.unsubscribe();
    }
  }

  getLineFailList() {
    if (this.cellLine && this.date) {
      this.failListSource.next(this.apiFailsService
        .search(this.date, {cell_line: this.cellLine, offset: this.failsOffset}));
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
