import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Rx';

import { ApiExamService } from './api-exam.service';
import { Exam } from '../exam';

@Injectable()
export class DateResolveService implements Resolve<string> {

  constructor(
      private apiExamService: ApiExamService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<string>|boolean {
    let date = route.params['date']
    if (date) {
      return Observable.of(date);
    }
    return this.apiExamService.getExam('latest')
      .map((exam:Exam): string => exam.date)
      .do((date:string) => this.apiExamService.addValidDate(date));
  }
}
