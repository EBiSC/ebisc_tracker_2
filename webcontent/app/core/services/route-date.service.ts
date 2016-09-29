import { Injectable }    from '@angular/core';
import { ActivatedRoute, Params } from'@angular/router';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Exam } from '../../shared/exam';
import { ApiExamService } from './api-exam.service';

@Injectable()
export class RouteDateService {

  // public properties
  readonly date$: Observable<string>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiExamService: ApiExamService,
  ) { 

    this.date$ = this.activatedRoute.params
      .switchMap((params: Params) => {
        if (params['date']) {
          return Observable.of(params['date']);
        }
        return apiExamService.getExam('latest')
         .map((exam:Exam) => exam ? exam.date : null);
      });

  };

};
