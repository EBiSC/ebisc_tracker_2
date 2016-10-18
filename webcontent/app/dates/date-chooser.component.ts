import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ExamList } from '../shared/exam-list';
import { ApiExamService } from '../core/services/api-exam.service';
import { sharedStyles } from '../shared/styles/shared.styles';

const dateChooserStyles: string = `
    .dates-table {
      max-width: 500px;
    }
`

@Component({
    templateUrl: './date-chooser.component.html',
    styles: [ dateChooserStyles, sharedStyles ],
})
export class DateChooserComponent implements OnInit {

  // public properties
  exams: {date: string}[] = [];

  constructor(
    private apiExamService: ApiExamService,
  ){};

  ngOnInit() {

    this.apiExamService.getList({})
      .subscribe((res: ExamList) => this.exams = res.items);
  };
};
