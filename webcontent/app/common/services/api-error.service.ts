import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import { BehaviorSubject }       from 'rxjs/BehaviorSubject';
import { Subject }          from 'rxjs/Subject';
import 'rxjs/add/operator/filter';

import { ApiErrorHandle } from '../api-error-handle';

@Injectable()
export class ApiErrorService {

  // private properties
  private errorSource: Subject<ApiErrorHandle> = new Subject<ApiErrorHandle>();

  // public methods
  getObservable(): Observable<ApiErrorHandle> {
    return this.errorSource.asObservable();
  }

  handleError(o: Observable<Response>, dismissFn?: () => any): Observable<Response> {
    let s = new BehaviorSubject<Response>(null);
    this.subscribe(o, s, dismissFn);
    return s.asObservable().filter((r:Response):boolean => r ? true : false);
  };

  // private methods
  private subscribe(o: Observable<Response>, s: BehaviorSubject<Response>, dismissFn?: () => any): void {
    o.subscribe(
      (res: Response) => s.next(res),
      (error: any) => {
        console.error('An error occurred', error); // for demo purposes only
        let json = error.json()
        let errMsg = json && json['message'] ? json['message']
                   : error.message ? error.message
                   : error.status ? `API error: ${error.status} - ${error.statusText}`
                   : 'API error';
        let retryFn: () => void = function() {
          this.subscribe(o, s, dismissFn);
          return;
        };
        this.errorSource.next(new ApiErrorHandle(errMsg, s, dismissFn, retryFn) );
      }
    );
    return;
  };

};

