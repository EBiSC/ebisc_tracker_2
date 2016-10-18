import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { Exam } from '../shared/exam';
import { ApiExamService } from '../core/services/api-exam.service';
import { RouteDateService } from '../core/services/route-date.service';
import { sharedStyles } from '../shared/styles/shared.styles';

const questionListStyles: string = `
  span.fails-badge {
    float: right;
  }
`;

@Component({
    templateUrl: './question-list.component.html',
    styles: [sharedStyles, questionListStyles],
})
export class QuestionListComponent implements OnInit, OnDestroy{

  // public properties
  date: string = null;
  exam: Exam;
  uncollapsed: {[module:string]: boolean} = {};

  // private properties
  private routeSubscription: Subscription = null;
  private examSource: Subject<Observable<Exam>>;
  private examSubscription: Subscription = null;
  
  constructor(
    private apiExamService: ApiExamService,
    private activatedRoute: ActivatedRoute,
    private routeDateService: RouteDateService,
  ){};

  ngOnInit() {
    this.examSource = new Subject<Observable<Exam>>();
    this.examSubscription = this.examSource
        .switchMap((o: Observable<Exam>):Observable<Exam> => o)
        .subscribe((e:Exam) => this.exam = e );
    this.routeSubscription =
      this.activatedRoute.data.subscribe((data: {date: string}) => {
        this.date = data.date;
        this.examSource.next(this.apiExamService.getExam(this.date));
      });
  };

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.examSubscription) {
      this.examSubscription.unsubscribe();
    }
  }

  linkParams(): {[s:string]: string} {
    return this.routeDateService.linkParams({});
  }
};
