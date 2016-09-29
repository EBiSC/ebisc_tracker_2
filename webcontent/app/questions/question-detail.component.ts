import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

import { Exam } from '../common/exam';
import { Fail } from '../common/fail';
import { FailList } from '../common/fail-list';
import { Question } from '../common/question';
import { RouteExamService } from '../common/services/route-exam.service';
import { RouteDateService } from '../common/services/route-date.service';
import { ApiFailsService } from '../common/services/api-fails.service';

@Component({
    templateUrl: './question-detail.component.html',
    styles: [`
      .fails-table {
        max-width: 500px;
      }
    `]
})
export class QuestionDetailComponent implements OnInit, OnDestroy{

  // public properties
  questionModule: string = null;
  question: Question;
  date: string = null;
  exam: Exam;
  fails: Fail[];

  // private properties
  private examSubscription: Subscription = null;
  private dateSubscription: Subscription = null;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private routeExamService: RouteExamService,
    private routeDateService: RouteDateService,
    private apiFailsService: ApiFailsService,
  ){};

  ngOnInit() {
    this.examSubscription =
      this.routeExamService.exam$.subscribe((exam:Exam) => {
        this.exam = exam;
        if (exam) {
          for (let question of exam.questions) {
            if (question.module == this.activatedRoute.snapshot.params['qModule']) {
              this.question = question;
              break;
            }
          }
        }
        else {
          this.question = null;
        }
    });
    this.dateSubscription =
      this.routeDateService.date$.do((date:string) => {
        this.questionModule = this.activatedRoute.snapshot.params['qModule'];
        this.date = date;
      })
      .switchMap((date:string): Observable<FailList> => {
        if (date && this.questionModule) {
          return this.apiFailsService.search(date, this.questionModule);
        }
        else {
          return Observable.of<FailList>(null);
        }
      })
      .subscribe((fails:FailList) => this.fails = fails ? fails.items : null);
  };

  ngOnDestroy() {
    if (this.examSubscription) {
      this.examSubscription.unsubscribe();
    }
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
  }
};
