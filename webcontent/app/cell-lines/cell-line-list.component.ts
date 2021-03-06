import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ApiLineFailsService } from '../core/services/api-line-fails.service';
import { RouteDateService } from '../core/services/route-date.service';
import { LineFailList } from '../shared/line-fail-list';
import { sharedStyles } from '../shared/styles/shared.styles';

const cellLineListStyles: string = `
    .fails-table {
      max-width: 500px;
    }
`

@Component({
    templateUrl: './cell-line-list.component.html',
    styles: [ cellLineListStyles, sharedStyles ],
})
export class CellLineListComponent implements OnInit, OnDestroy{

  // public properties
  date: string = null;
  lineFailList: LineFailList;
  lineFailsOffset: number

  // private properties
  private lineFailListSource: Subject<Observable<LineFailList>>;
  private lineFailListSubscription: Subscription = null;
  private dateSubscription: Subscription = null;
  
  constructor(
    private apiLineFailsService: ApiLineFailsService,
    private routeDateService: RouteDateService,
  ){ };

  ngOnInit() {

    this.lineFailListSource =
        new Subject<Observable<LineFailList>>();
    this.lineFailListSubscription = this.lineFailListSource
        .switchMap((o: Observable<LineFailList>):Observable<LineFailList> => o)
        .subscribe((l:LineFailList) => this.lineFailList = l );

    this.dateSubscription =
      this.routeDateService.date$.subscribe((date: string) => {
        this.date = date;
        this.lineFailsOffset = 0;
        this.getLineFailList();
      });
  };

  ngOnDestroy() {
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
  }

  getLineFailList() {
    this.lineFailListSource.next(this.apiLineFailsService
      .search(this.date, this.lineFailsOffset));
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
