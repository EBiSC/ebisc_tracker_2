import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ApiExamService } from '../core/services/api-exam.service';
import { Exam } from '../shared/exam';
import { RouteDateService } from '../core/services/route-date.service';
import { QuestionTimeline } from '../shared/question-timeline';
import { ApiQuestionTimelineService } from '../core/services/api-question-timeline.service';

@Component({
    templateUrl: './question-detail-outlet.component.html',
})
export class QuestionDetailOutletComponent implements OnInit, OnDestroy{

  // public properties
  questionModule: string = null;
  date: string = null;
  exam: Exam;
  qTimeline: QuestionTimeline;

  // private properties
  private routeParamsSubscription: Subscription = null;
  private dateSubscription: Subscription = null;
  private examSource: Subject<Observable<Exam>>;
  private examSubscription: Subscription = null;
  private qTimelineSource: Subject<Observable<QuestionTimeline>>;
  private qTimelineSubscription: Subscription;
  
  constructor(
    private apiQuestionTimelineService: ApiQuestionTimelineService,
    private apiExamService: ApiExamService,
    private activatedRoute: ActivatedRoute,
    private routeDateService: RouteDateService,
  ){};

  ngOnInit() {
    this.examSource = new Subject<Observable<Exam>>();
    this.qTimelineSource = new Subject<Observable<QuestionTimeline>>();
    this.examSubscription = this.examSource
        .switchMap((o: Observable<Exam>):Observable<Exam> => o)
        .subscribe((e:Exam) => this.exam = e );
    this.qTimelineSubscription = this.qTimelineSource
        .switchMap((o: Observable<QuestionTimeline>):Observable<QuestionTimeline> => o)
        .subscribe((q:QuestionTimeline) => this.qTimeline = q);
    this.routeParamsSubscription =
      this.activatedRoute.params.subscribe((params: {qModule: string}) => {
        this.questionModule = params.qModule;
        if (this.questionModule) {
          this.qTimelineSource.next(
            this.apiQuestionTimelineService.getTimeline(this.questionModule, {})
          );
        }
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
    if (this.qTimelineSubscription) {
      this.qTimelineSubscription.unsubscribe();
    }
  }
};
