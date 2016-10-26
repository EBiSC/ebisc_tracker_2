import { Injectable }    from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { Exam } from '../../shared/exam';
import { ExamList } from '../../shared/exam-list';
import { ApiErrorService } from './api-error.service';

@Injectable()
export class ApiExamService {

  // private properties
  private examObservables: {[date:string]: Observable<Exam>} = {}

  constructor(private http: Http, private apiErrorService: ApiErrorService) { }

  // public methods

  public getExam(date: string): Observable<Exam>{
    if (!date) {
      return this.getLatestExam();
    }
    if (this.examObservables[date]) {
      return this.examObservables[date];
    }
    return this._apiGetExam(date);
  }

  public getLatestExam(): Observable<Exam>{
    let key:string = 'latest';
    if (this.examObservables[key]) {
      return this.examObservables[key];
    }
    return this._apiGetExam(key).do((exam:Exam) => {
      let date = exam.date;
      if (! this.examObservables[date]) {
        this.examObservables[date] = this.examObservables[key];
      }
    });
  }

  public getList(params: {[param:string]: string|number}): Observable<ExamList>{
    let p = new URLSearchParams();
    for (let param in params) {
      p.set(param, ""+params[param]);
    }
    let o: Observable<Response> = this.http.get(`/api/exams`, {search: p});
    return this.apiErrorService.handleError(o)
      .map((res:Response):ExamList => res ? res.json() as ExamList : null);
  };

  // private methods

  private _apiGetExam(date: string): Observable<Exam>{
    let o: Observable<Response> = this.http.get(`/api/exams/${date}`);
    this.examObservables[date] =
      this.apiErrorService.handleError(o, () => delete this.examObservables[date])
      .map((res:Response):Exam => res ? res.json() as Exam : null);
    return this.examObservables[date];
  }

}
