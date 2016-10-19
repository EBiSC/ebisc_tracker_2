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
  private dateSnapshot: string
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
        .map(event => this.inspectRouter())
        .subscribe(date => {
          this.dateSnapshot = date;
          this.dateSource.next(date)
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
    return this.dateSnapshot;
  }

  linkParams(o: {[s:string]: string}): {[s:string]:string} {
    let date = this.dateSnapshot;
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

