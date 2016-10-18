import { Injectable }    from '@angular/core';
import { RouterStateSnapshot, Resolve, ActivatedRouteSnapshot } from'@angular/router';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Exam } from '../../shared/exam';
import { ApiExamService } from './api-exam.service';

@Injectable()
export class DateResolver implements Resolve<string>  {

  constructor(
    private apiExamService: ApiExamService,
  ) { };

  resolve (
   route: ActivatedRouteSnapshot,
   state: RouterStateSnapshot
  ): Observable<string> | string {
    if (route.params["date"] && route.params["date"] !== 'latest') {
      return route.params["date"];
    }
    return this.apiExamService.getLatestExam()
      .map((exam:Exam) => exam.date);
  }


};
