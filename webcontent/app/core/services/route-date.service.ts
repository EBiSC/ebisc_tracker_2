import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';

@Injectable()
export class RouteDateService {

  // public properties
  readonly date$: Observable<string>;

  // private properties
  private dateSource: ReplaySubject<string>;

  constructor(
  ) {
    this.dateSource = new ReplaySubject<string>(1)
    this.date$ = this.dateSource.asObservable().distinctUntilChanged()
  };

  nextDate(date:string) {
    this.dateSource.next(date);
  }

};

