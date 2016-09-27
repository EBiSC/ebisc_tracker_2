import { Component, OnInit } from '@angular/core';
import { ApiExamService } from './common/services/api-exam.service'

import { Exam } from './common/exam'

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    providers: [ ApiExamService ]
})
export class AppComponent implements OnInit{ 
  error: string;
  exam: Exam = null;

  constructor( private apiExamService: ApiExamService) {}

  ngOnInit(): void {
    this.apiExamService.getExam('latest')
      .subscribe(
        exam => {this.exam = exam; this.error = null},
        err => this.error = err
      );
  }
}
