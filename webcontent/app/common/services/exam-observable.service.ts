import { Injectable }    from '@angular/core';
import { ActivatedRoute, Params } from'@angular/router';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Exam } from '../exam';
import { ApiExamService } from './api-exam.service';

@Injectable()
export class ExamObservableService {

  // private properties
  readonly exam$: Observable<Exam>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiExamService: ApiExamService,
  ) { 

    this.exam$ = this.activatedRoute.params
      .map((params: Params) => {
        return apiExamService.getExam(params['date'] || 'latest');
      })
      .switchMap((o:Observable<Exam>) => o);

  };

};
