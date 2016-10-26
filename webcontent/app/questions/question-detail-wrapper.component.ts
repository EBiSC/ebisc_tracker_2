import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ApiExamService } from '../core/services/api-exam.service';
import { Exam } from '../shared/exam';

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
  private routeDataSubscription: Subscription = null;
  private examSource: Subject<Observable<Exam>>;
  private examSubscription: Subscription = null;
  
  constructor(
    private apiExamService: ApiExamService,
    private activatedRoute: ActivatedRoute,
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
    this.routeDataSubscription = 
      this.activatedRoute.data.subscribe((data: {date: string}) => {
        this.date = data.date;
        this.examSource.next(this.apiExamService.getExam(this.date));
      });
  };

  ngOnDestroy() {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
    if (this.routeDataSubscription) {
      this.routeDataSubscription.unsubscribe();
    }
    if (this.examSubscription) {
      this.examSubscription.unsubscribe();
    }
  }
};
