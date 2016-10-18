import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
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
    `],
    styleUrls: ['../shared/css/shared.css'],
})
export class CellLineListComponent implements OnInit, OnDestroy{

  // public properties
  date: string = null;
  lineFailList: LineFailList;
  lineFailsOffset: number

  // private properties
  private lineFailListSource: Subject<Observable<LineFailList>>;
  private lineFailListSubscription: Subscription = null;
  private routeSubscription: Subscription = null;
  
  constructor(
    private apiLineFailsService: ApiLineFailsService,
    private activatedRoute: ActivatedRoute,
    private routeDateService: RouteDateService,
  ){ };

  ngOnInit() {

    this.lineFailListSource =
        new Subject<Observable<LineFailList>>();
    this.lineFailListSubscription = this.lineFailListSource
        .switchMap((o: Observable<LineFailList>):Observable<LineFailList> => o)
        .subscribe((l:LineFailList) => this.lineFailList = l );

    this.routeSubscription =
      this.activatedRoute.data.subscribe((data: {date: string}) => {
        this.date = data.date;
        this.lineFailsOffset = 0;
        this.getLineFailList();
      });
  };

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
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

  linkParams(): {[s:string]: string} {
    return this.routeDateService.linkParams({});
  }
};
