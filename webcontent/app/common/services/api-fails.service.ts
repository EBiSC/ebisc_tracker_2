import { Injectable }    from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { FailList } from '../fail-list';
import { ApiErrorService } from './api-error.service';

@Injectable()
export class ApiFailsService {

  constructor(private http: Http, private apiErrorService: ApiErrorService) { };

  // public methods

  public search(date: string, module: string, offset?: number): Observable<FailList>{
    let params = new URLSearchParams();
    params.set('module', module);
    params.set('offset', ""+(offset || 0));
    params.set('limit', "20");
    let o: Observable<Response> = this.http.get(`/api/exams/${date}/fails`, {search: params});
    return this.apiErrorService.handleError(o)
      .map((res:Response):FailList => res ? res.json() as FailList : null);
  };

}
