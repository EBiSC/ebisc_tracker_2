import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

import { Exam } from '../shared/exam';
import { RouteExamService } from '../core/services/route-exam.service';
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
  private examSubscription: Subscription = null;
  private dateSubscription: Subscription = null;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private routeExamService: RouteExamService,
    private routeDateService: RouteDateService,
  ){};

  ngOnInit() {
    this.examSubscription =
      this.routeExamService.exam$.subscribe((exam:Exam) => this.exam = exam);
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
