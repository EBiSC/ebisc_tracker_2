import { Component, OnChanges, OnDestroy, SimpleChanges, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';

import { Exam } from '../shared/exam';
import { QuestionTimeline } from '../shared/question-timeline';
import { Fail } from '../shared/fail';
import { ApiQuestionTimelineService } from '../core/services/api-question-timeline.service';

@Component({
    selector: 'question-detail-embedded',
    template: `<question-detail [questionModule]="questionModule" [exam]="exam" [date]="date" [qTimeline]="qTimeline"></question-detail>`,
})
export class QuestionDetailEmbeddedComponent implements OnDestroy, OnChanges{
  @Input() questionModule: string;
  @Input() exam: Exam;
  @Input() date: string;

  // public properties
  @Input() qTimeline: QuestionTimeline;

  // private properties
  private qTimelineSource: Subject<Observable<QuestionTimeline>>;
  private qTimelineSubscription: Subscription;

  constructor(
    private apiQuestionTimelineService: ApiQuestionTimelineService,
  ){ };

  initQTimelineSource() {
    this.qTimelineSource = new Subject<Observable<QuestionTimeline>>();
    this.qTimelineSubscription = this.qTimelineSource
        .switchMap((o: Observable<QuestionTimeline>):Observable<QuestionTimeline> => o)
        .subscribe((q:QuestionTimeline) => this.qTimeline = q);
  };

  ngOnDestroy() {
    if (this.qTimelineSubscription) {
      this.qTimelineSubscription.unsubscribe();
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (! this.qTimelineSource) {
      this.initQTimelineSource();
    }
    if (changes['questionModule'] && this.questionModule) {
      for (let question of this.exam.questions) {
        if (question.module == this.questionModule) {
          this.qTimelineSource.next(
            this.apiQuestionTimelineService.getTimeline(this.questionModule, {})
          );
        }
      }
    } else {
      this.qTimelineSource.next(Observable.of<QuestionTimeline>(null));
    };
  };

};
