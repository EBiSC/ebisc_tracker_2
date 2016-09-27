import { Injectable } from '@angular/core';
import { Observable }       from 'rxjs/Observable';
import { Subject }          from 'rxjs/Subject';

@Injectable()
export class ApiErrorService {

  // private properties
  private errorSource: Subject<string> = new Subject<string>();

  // public methods
  getObservable(): Observable<string> {
    return this.errorSource.asObservable();
  }

  emit(error: any) {
    console.error('An error occurred', error); // for demo purposes only
    let json = error.json()
    let errMsg = json && json['message'] ? json['message']
               : error.message ? error.message
               : error.status ? `API error: ${error.status} - ${error.statusText}`
               : 'API error'
    this.errorSource.next(errMsg);
    return;
  }

  catchError<T>(error: any, caught: Observable<T>): Observable<T> {
    console.error('An error occurred', error); // for demo purposes only
    let json = error.json()
    let errMsg = json && json['message'] ? json['message']
               : error.message ? error.message
               : error.status ? `API error: ${error.status} - ${error.statusText}`
               : 'API error'
    this.errorSource.next(errMsg);
    return caught;
  }



};

