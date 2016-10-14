import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import { ReplaySubject }       from 'rxjs/ReplaySubject';
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
    let s = new ReplaySubject<Response>(1);
    this.subscribe(o, s, dismissFn);
    return s.asObservable();
  };

  // private methods
  private subscribe(o: Observable<Response>, s: ReplaySubject<Response>, dismissFn?: () => any): void {
    let service = this;
    o.subscribe(
      (res: Response) => {
        s.next(res);
        s.complete();
      },
      (error: any) => {
        console.error('An error occurred', error); // for demo purposes only

        let errMsg = ""
        if (typeof error._body === 'string') {
          interface ApiErrorResp {
            message: string
          }
          var apiErrorResp:ApiErrorResp = JSON.parse(error._body);
          if (apiErrorResp.message) {
            errMsg = ` - ${apiErrorResp.message}`;
          }
        }
        if (!errMsg && error.message) {
            errMsg = ` - ${error.message}`;
        }
        let errStatus = error.status ? `${error.status}` : "Could not connect";
        errMsg = `API error: ${errStatus}${errMsg}`;

        let retryFn: () => void = function() {
          service.subscribe(o, s, dismissFn);
          return;
        };
        this.errorSource.next(new ApiErrorHandle(errMsg, s, dismissFn, retryFn) );
      }
    );
    return;
  };

};

