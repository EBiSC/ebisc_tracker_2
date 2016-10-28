import { Injectable } from '@angular/core';

@Injectable()
export class GoogleLoadedService {

  // private properties
  readonly isLoaded: {[name:string]: boolean} = {};

  public load(name:string) {
    google.charts.load('current', {'packages':[name]});
    this.isLoaded[name] = true;
  }
};

