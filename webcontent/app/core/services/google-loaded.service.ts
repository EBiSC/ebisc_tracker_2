import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GoogleLoadedService {

  // private properties
  private isLoaded$: {[name:string]: Observable<boolean>} = {};

  public load(name:string): Observable<boolean> {
    if (!this.isLoaded$[name]) {
      let isLoadedSource = new ReplaySubject<boolean>(1);
      google.charts.load('current', {'packages':[name]});
      google.charts.setOnLoadCallback(() => isLoadedSource.next(true));
      this.isLoaded$[name] = isLoadedSource.asObservable();
    }
    return this.isLoaded$[name];
  }
};

