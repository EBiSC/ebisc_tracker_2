import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiLineFailsService } from '../core/services/api-line-fails.service';
import { RouteDateService } from '../core/services/route-date.service';
import { LineFailList } from '../shared/line-fail-list';

@Component({
    templateUrl: './cell-line-list.component.html',
    styles: [`
      .fails-table {
        max-width: 500px;
      }
    `]
})
export class CellLineListComponent implements OnInit, OnDestroy{

  // public properties
  date: string = null;
  lineFailList: LineFailList;
  lineFailsOffset: number = 0;

  // private properties
  private dateSubscription: Subscription = null;
  private lineFailListSource: ReplaySubject<Observable<LineFailList>>;
  private lineFailListSubscription: Subscription = null;
  
  constructor(
    private routeDateService: RouteDateService,
    private apiLineFailsService: ApiLineFailsService,
  ){ };

  ngOnInit() {

    this.lineFailListSource =
        new ReplaySubject<Observable<LineFailList>>(1);
    this.lineFailListSubscription = this.lineFailListSource
        .switchMap((o: Observable<LineFailList>):Observable<LineFailList> => o)
        .subscribe((l:LineFailList) => this.lineFailList = l );

    this.dateSubscription =
      this.routeDateService.date$.subscribe((date:string) => {
         this.date = date 
         this.getLineFailList();
      });
  };

  ngOnDestroy() {
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
    if (this.lineFailListSubscription) {
      this.lineFailListSubscription.unsubscribe();
    }
  }

  getLineFailList() {
    if (this.date) {
      this.lineFailListSource.next(this.apiLineFailsService
        .search(this.date, this.lineFailsOffset));
    }
    else {
      this.lineFailListSource.next(Observable.empty<LineFailList>());
    }
  }

  tableNext() {
    if (this.tableHasMore()) {
      this.lineFailsOffset += this.lineFailList.pageLimit;
      this.getLineFailList();
    }
  }
  tablePrevious() {
    if (this.lineFailList && this.lineFailList.items) {
      this.lineFailsOffset = (this.lineFailsOffset >= this.lineFailList.pageLimit) ? this.lineFailsOffset - this.lineFailList.pageLimit : 0;
      this.getLineFailList();
    }
  }
  tableHasMore():boolean {
    if (this.lineFailList && this.lineFailList.total > this.lineFailsOffset + this.lineFailList.pageLimit) {
      return true;
    }
    return false;
  }
};
