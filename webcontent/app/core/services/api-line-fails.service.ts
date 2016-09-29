import { Injectable }    from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { LineFailList } from '../../shared/line-fail-list';
import { ApiErrorService } from './api-error.service';

@Injectable()
export class ApiLineFailsService {

  constructor(private http: Http, private apiErrorService: ApiErrorService) { };

  // public methods

  public search(date: string, offset?: number): Observable<LineFailList>{
    let params = new URLSearchParams();
    params.set('offset', ""+(offset || 0));
    params.set('limit', "20");
    let o: Observable<Response> = this.http.get(`/api/exams/${date}/line_fails`, {search: params});
    return this.apiErrorService.handleError(o)
      .map((res:Response):LineFailList => res ? res.json() as LineFailList : null);
  };

}
