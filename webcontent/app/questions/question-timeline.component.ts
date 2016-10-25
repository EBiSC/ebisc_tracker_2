import { Component, OnChanges, OnDestroy, SimpleChanges, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/empty';

import { QuestionTimeline } from '../shared/question-timeline';
import { ApiQuestionTimelineService } from '../core/services/api-question-timeline.service';

@Component({
    selector: 'question-timeline',
    templateUrl: './question-timeline.component.html',
    styles: [`
      .date-table {
        max-width: 500px;
      }
    `]
})
export class QuestionTimelineComponent implements OnDestroy, OnChanges{
  @Input() questionModule: string;

  // public properties
  qTimeline: QuestionTimeline;

  // private properties
  private qTimelineSource: Subject<Observable<QuestionTimeline>>;
  private qTimelineSubscription: Subscription;

  constructor(
    private apiQuestionTimelineService: ApiQuestionTimelineService,
  ){ };

  ngOnDestroy() {
    if (this.qTimelineSubscription) {
      this.qTimelineSubscription.unsubscribe();
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (! this.qTimelineSource) {
      this.qTimelineSource = new Subject<Observable<QuestionTimeline>>();
      this.qTimelineSubscription = this.qTimelineSource
          .switchMap((o: Observable<QuestionTimeline>):Observable<QuestionTimeline> => o)
          .subscribe((q:QuestionTimeline) => this.qTimeline = q );
    }
    if (this.questionModule) {
      this.qTimelineSource.next(this.apiQuestionTimelineService.getTimeline(this.questionModule, {}));
    }
    else {
      this.qTimelineSource.next(Observable.empty<QuestionTimeline>());
    }
  };
};
