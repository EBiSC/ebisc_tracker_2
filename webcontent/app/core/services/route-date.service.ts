import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Route } from'@angular/router';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

import { ApiExamService } from './api-exam.service';
import { Exam } from '../../shared/exam';

@Injectable()
export class RouteDateService {

  // public properties
  readonly date$: Observable<string>;
  readonly resolvedDate$: Observable<string>;

  // private properties
  private bottomActivatedRoute: ActivatedRoute
  private dateSource: ReplaySubject<string>;
  private resolvedDateSource: ReplaySubject<Observable<Exam>>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiExamService: ApiExamService,
  ) {
    if (router && apiExamService) {
      this.dateSource = new ReplaySubject<string>(1);
      this.resolvedDateSource = new ReplaySubject<Observable<Exam>>(1);

      this.date$ = this.dateSource.asObservable();
      this.resolvedDate$ = this.resolvedDateSource.asObservable()
        .switchMap(o => o).map((e: Exam) => e.date);

      router.events.filter(event => event instanceof NavigationEnd)
        .map(event => this.descendRouter())
        .subscribe(route => {
            let date = route.snapshot.params["date"];
            this.dateSource.next(date);
            this.bottomActivatedRoute = route;
        });

      this.dateSource.subscribe(date => {
        this.resolvedDateSource.next(
          date ? apiExamService.getExam(date) : apiExamService.getLatestExam()
        );
      });
    }
  };

  // public methods
  getDate(): string {
    return this.bottomActivatedRoute ? this.bottomActivatedRoute.snapshot.params["date"] : null;
  }
  getBottomActivatedRoute(): ActivatedRoute {
    return this.bottomActivatedRoute;
  }

  linkParams(o: {[s:string]: string}): {[s:string]:string} {
    let date = this.getDate();
    if (date && date !== 'latest') {
      o['date'] = date;
    }
    return o;
  }

  private descendRouter(): ActivatedRoute {
    let candidateRoute = this.activatedRoute.root;
    let chosenRoute = candidateRoute
    while (candidateRoute) {
      let children = candidateRoute.children
      candidateRoute = null;
      children.forEach(child => {
        if (child.outlet === 'primary') {
          candidateRoute = child;
          chosenRoute = child;
        }
      });
    }
    return chosenRoute;
  }

};

