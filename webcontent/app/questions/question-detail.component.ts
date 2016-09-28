import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Exam } from '../common/exam';
import { Question } from '../common/question';
import { RouteExamService } from '../common/services/route-exam.service';
import { RouteDateService } from '../common/services/route-date.service';

@Component({
    templateUrl: './question-detail.component.html'
})
export class QuestionDetailComponent implements OnInit, OnDestroy{

  // public properties
  questionModule: string = null;
  question: Question;
  date: string = null;
  exam: Exam;

  // private properties
  private examSubscription: Subscription = null;
  private dateSubscription: Subscription = null;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private routeExamService: RouteExamService,
    private routeDateService: RouteDateService,
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
      this.routeDateService.date$.subscribe((date:string) => {
        this.questionModule = this.activatedRoute.snapshot.params['qModule'];
        this.date = date;
      });
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
