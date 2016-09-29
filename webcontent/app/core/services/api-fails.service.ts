import { Injectable }    from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { FailList } from '../../shared/fail-list';
import { ApiErrorService } from './api-error.service';

@Injectable()
export class ApiFailsService {

  constructor(private http: Http, private apiErrorService: ApiErrorService) { };

  // public methods

  public search(date: string, params: {[param:string]: string|number}): Observable<FailList>{
    let p = new URLSearchParams();
    p.set('offset', "0"); // default
    p.set('limit', "20"); // default
    for (let param in params) {
      p.set(param, ""+params[param]);
    }
    let o: Observable<Response> = this.http.get(`/api/exams/${date}/fails`, {search: p});
    return this.apiErrorService.handleError(o)
      .map((res:Response):FailList => res ? res.json() as FailList : null);
  };

}
