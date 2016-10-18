import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Route } from'@angular/router';

@Injectable()
export class RouteDateService {

  // private properties
  private date: string

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    if (router) {
      router.events.filter(event => event instanceof NavigationEnd)
         .subscribe(event =>  this.date = null );
    }
  };

  // public methods
  getDate(): string {
    if (this.date) {
      return this.date;
    }

    let route = this.activatedRoute.root;
    while (route) {
      let snapshot = route.snapshot;
      if (snapshot.params["date"]) {
        this.date = snapshot.params["date"];
        return this.date;
      }
      let children = route.children;
      route = null;
      children.forEach(child => {
        if (child.outlet === 'primary') {
          route = child;
        }
      });
    }
    return null;
  }

  linkParams(o: {[s:string]: string}): {[s:string]:string} {
    let date = this.getDate();
    if (date) {
      o['date'] = date;
    }
    return o;
  }

};

