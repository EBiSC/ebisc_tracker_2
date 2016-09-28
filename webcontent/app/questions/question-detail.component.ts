import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from'@angular/router';

import { Exam } from '../common/exam';
import { ExamObservableService } from '../common/services/exam-observable.service';

@Component({
    templateUrl: './question-detail.component.html'
})
export class QuestionDetailComponent implements OnInit{

  questionModule: string = null;
  date: string = null;
  exam: Exam;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private examObservableService: ExamObservableService,
  ){};

  getDate(): string {
    return this.date || this.exam ? this.exam.date : null;
  }

  ngOnInit() {
    this.examObservableService.exam$.subscribe((exam:Exam) => this.exam = exam);
    this.activatedRoute.params.forEach((params: Params) => {
      this.questionModule = params['qModule'];
      this.date = params['date'];
    });
  }
};
