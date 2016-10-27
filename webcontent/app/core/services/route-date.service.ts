import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';

import { ApiExamService } from '../services/api-exam.service';

@Injectable()
export class RouteDateService {

  // public properties
  readonly date$: Observable<string>;
  readonly isLatest$: Observable<boolean>;

  // private properties
  private dateSource: BehaviorSubject<Observable<string>>;

  constructor(
    private apiExamService: ApiExamService,
  ) {
    let initObservable = this.apiExamService.getLatestExam()
        .map((exam:{date:string}):string => exam.date);
    this.dateSource = new BehaviorSubject<Observable<string>>(initObservable)

    this.date$ = this.dateSource.asObservable()
      .switchMap(o => o).distinctUntilChanged()
    this.isLatest$ = this.date$.switchMap((date:string): Observable<boolean> => {
      return this.apiExamService.getLatestExam()
          .map((exam:{date:string}): boolean => date === exam.date ? true : false );
    });
  };

  nextDate(date:string) {
    if (date) {
      this.dateSource.next(Observable.of(date));
    }
    else {
      this.dateSource.next(this.apiExamService.getLatestExam()
        .map((exam:{date:string}) => exam.date ));
    }
  }

};

