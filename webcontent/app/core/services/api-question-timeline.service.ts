import { Injectable }    from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { QuestionTimeline } from '../../shared/question-timeline';
import { ApiErrorService } from './api-error.service';

@Injectable()
export class ApiQuestionTimelineService {

  constructor(private http: Http, private apiErrorService: ApiErrorService) { };

  // public methods

  public getTimeline(module: string, params: {[name: string]: string|number}): Observable<QuestionTimeline>{
    let p = new URLSearchParams();
    for (let param in params) {
      p.set(param, ""+params[param]);
    }
    let o: Observable<Response> = this.http.get(`/api/questions/${module}`, {search: p});
    return this.apiErrorService.handleError(o)
      .map((res:Response):QuestionTimeline => res ? res.json() as QuestionTimeline : null);
  };

}
