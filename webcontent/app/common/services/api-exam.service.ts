import { Injectable }    from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Exam } from '../exam';

@Injectable()
export class ApiExamService {

  // private properties
  private exams: {[date:string]: Exam} = {}
  private examObservables: {[date:string]: Observable<Exam>} = {}
  private validDates: {[date:string]: boolean} = {}

  constructor(private http: Http) { }

  // public methods

  getExam(date: string): Observable<Exam>{
    return this._getExam(date).catch(this.handleError);
  }

  queryValidDate(date: string): Observable<boolean> {
    if (this.validDates[date]) {
      return Observable.of(this.validDates[date]);
    }
    return this._getExam(date)
      .map((exam:Exam) => true)
      .catch(error => {
        if (this.validDates.hasOwnProperty(date)) {
          return Observable.of(this.validDates[date]);
        }
        return Observable.throw<Exam>(error);
      });
  }

  addValidDate(date: string, valid: boolean = true) {
    this.validDates[date] = valid;
  }

  // private methods

  private _getExam(date: string): Observable<Exam>{
    if (this.exams[date]) {
      return Observable.of(this.exams[date]);
    }
    if (! this.examObservables[date]) {
      this.examObservables[date] = this._apiGetExam(date);
    }
    return this.examObservables[date];
  }

  private _apiGetExam(date: string): Observable<Exam>{
    return this.http.get(`/api/exams/${date}`)
      .map((res:Response) => {
        this.exams[date] = res.json() as Exam;
        this.addValidDate(date);
        return this.exams[date];
      })
      .catch(error => this.handleNotFound(error, date))
      .finally(() => {
        this.examObservables[date] = null;
        return Observable.empty<Exam>();
      })
      .share();
  }

  private handleNotFound(error: any, date: string): Observable<Exam>{
    if (error.message && error.message == 404) {
      this.addValidDate(date, false);
    }
    return Observable.throw<Exam>(error);
  }

  private handleError(error: any): Observable<Exam> {
    console.error('An error occurred', error); // for demo purposes only
    let json = error.json()
    let errMsg = json && json['message'] ? json['message']
               : error.message ? error.message
               : error.status ? `API error: ${error.status} - ${error.statusText}`
               : 'API error'
    return Observable.throw<Exam>(errMsg)
  }

}
