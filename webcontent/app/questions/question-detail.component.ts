import { Component, OnChanges, OnDestroy, SimpleChanges, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/empty';

import { Exam } from '../shared/exam';
import { Fail } from '../shared/fail';
import { FailList } from '../shared/fail-list';
import { Question } from '../shared/question';
import { ApiFailsService } from '../core/services/api-fails.service';

@Component({
    selector: 'question-detail',
    templateUrl: './question-detail.component.html',
    styles: [`
      .fails-table {
        max-width: 500px;
      }
    `]
})
export class QuestionDetailComponent implements OnDestroy, OnChanges{
  @Input() questionModule: string;
  @Input() exam: Exam;
  @Input() date: string;


  // public properties
  question: Question;
  failList: FailList;
  failsOffset: number = 0;

  // private properties
  private failListSource: Subject<Observable<FailList>>;
  private failListSubscription: Subscription;

  constructor(
    private apiFailsService: ApiFailsService,
  ){ };

  initFailListSource() {
    this.failListSource = new Subject<Observable<FailList>>();
    this.failListSubscription = this.failListSource
        .switchMap((o: Observable<FailList>):Observable<FailList> => o)
        .subscribe((f:FailList) => this.failList = f );
  };

  ngOnDestroy() {
    if (this.failListSubscription) {
      this.failListSubscription.unsubscribe();
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (! this.failListSource) {
      this.initFailListSource();
    }
    if (changes['exam'] || changes['questionModule']) {
      if (this.exam && this.questionModule) {
        for (let question of this.exam.questions) {
          if (question.module == this.questionModule) {
            this.question = question;
            break;
          }
        }
      }
      else {
        this.question = null;
      }
    }

    if (changes['date'] || changes['questionModule']) {
      this.failsOffset = 0;
      this.getFailList();
    }
  };

  private getFailList() {
    if (this.date && this.questionModule) {
      this.failListSource.next(this.apiFailsService.search(this.date, {module: this.questionModule, offset: this.failsOffset}));
    }
    else {
      this.failListSource.next(Observable.empty<FailList>());
    }
  }

  tableNext() {
    if (this.tableHasMore()) {
      this.failsOffset += this.failList.pageLimit;
      this.getFailList();
    }
  }
  tablePrevious() {
    if (this.failList && this.failList.items) {
      this.failsOffset = (this.failsOffset >= this.failList.pageLimit) ? this.failsOffset - this.failList.pageLimit : 0;
      this.getFailList();
    }
  }
  tableHasMore():boolean {
    if (this.failList && this.failList.total > this.failsOffset + this.failList.pageLimit) {
      return true;
    }
    return false;
  }
};
