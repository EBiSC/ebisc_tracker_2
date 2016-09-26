import { Injectable }    from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {
  constructor(private http: Http) { }

  getExam(date: string): Observable<{[key:string]: any}>{
    return this.http.get(`/api/exams/${date}`)
      .map((res:Response) => res.json())
      .catch((error:any) => this.handleError(error))
  }

  private handleError(error: any) {
    console.error('An error occurred', error); // for demo purposes only
    let json = error.json()
    let errMsg = json && json['message'] ? json['message']
               : error.message ? error.message
               : error.status ? `API error: ${error.status} - ${error.statusText}`
               : 'API error'
    return Observable.throw(errMsg)
  }

}
