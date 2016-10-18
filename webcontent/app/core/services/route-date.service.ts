import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Route } from'@angular/router';
import { Observable } from 'rxjs/Observable';

import { ApiExamService } from './api-exam.service';

@Injectable()
export class RouteDateService {

  // public properties
  readonly date$: Observable<string>;
  readonly resolvedDate$: Observable<string>;

  // private properties
  private date: string

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiExamService: ApiExamService,
  ) {
    if (router && apiExamService) {
      router.events.filter(event => event instanceof NavigationEnd)
         .subscribe(event =>  this.date = null );

      this.date$ = router.events.filter(event => event instanceof NavigationEnd)
        .map(event => this.inspectRouter());

      this.resolvedDate$ = this.date$.map(date => {
        return date ? apiExamService.getExam(date) : apiExamService.getLatestExam();
      })
       .switchMap(o => o).map((exam: {date: string}) => exam.date);
    }
  };

  // public methods
  getDate(): string {
    if (! this.date) {
      this.date = this.inspectRouter();
    }
    return this.date;
  }

  linkParams(o: {[s:string]: string}): {[s:string]:string} {
    let date = this.getDate();
    if (date && date !== 'latest') {
      o['date'] = date;
    }
    return o;
  }

  // private methods
  private inspectRouter(): string {
    let route = this.activatedRoute.root;
    while (route && route.snapshot) {
      let snapshot = route.snapshot;
      if (snapshot.params["date"]) {
        return snapshot.params["date"];
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

};

