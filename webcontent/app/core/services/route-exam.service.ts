import { Injectable }    from '@angular/core';
import { ActivatedRoute, Params } from'@angular/router';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';

import { Exam } from '../../shared/exam';
import { ApiExamService } from './api-exam.service';

@Injectable()
export class RouteExamService {

  // public properties
  readonly exam$: Observable<Exam>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiExamService: ApiExamService,
  ) { 

    this.exam$ = this.activatedRoute.params
      .switchMap((params: Params) => {
        return apiExamService.getExam(params['date'] || 'latest');
      });

  };

};
