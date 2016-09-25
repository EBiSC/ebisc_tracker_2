import { Injectable }    from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {
  constructor(private http: Http) { }

  private getExam(date: string) {
    return this.http.get(`/api/exams/${date}`)
      .map((res:Response) => res.json())
      .catch((error:any) => handleError(error))
  }

  private handleError(error: any): Observable<string> {
    console.error('An error occurred', error); // for demo purposes only
    return Observable.throw(error.json().message || 'API Error')
  }



}
