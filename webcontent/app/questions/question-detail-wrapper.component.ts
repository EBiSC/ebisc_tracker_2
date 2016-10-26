import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ApiExamService } from '../core/services/api-exam.service';
import { Exam } from '../shared/exam';
import { RouteDateService } from '../core/services/route-date.service';

@Component({
    templateUrl: './question-detail-wrapper.component.html',
})
export class QuestionDetailWrapperComponent implements OnInit, OnDestroy{

  // public properties
  questionModule: string = null;
  date: string = null;
  exam: Exam;

  // private properties
  private routeParamsSubscription: Subscription = null;
  private dateSubscription: Subscription = null;
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
    this.routeParamsSubscription =
      this.activatedRoute.params.subscribe((params: {qModule: string}) => {
        this.questionModule = params.qModule;
      });
    this.dateSubscription =
      this.routeDateService.date$.subscribe((date: string) => {
        this.date = date;
        this.examSource.next(this.apiExamService.getExam(this.date));
      });
  };

  ngOnDestroy() {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
    if (this.examSubscription) {
      this.examSubscription.unsubscribe();
    }
  }
};
