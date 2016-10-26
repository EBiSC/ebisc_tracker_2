import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from'@angular/router';

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
  hasMore: boolean = false;
  isLoading: boolean = false;

  // private properties
  earliestDate: string;

  constructor(
    private apiExamService: ApiExamService,
    private router: Router,
  ){};

  ngOnInit() {
    this.getList();
  };

  getList() {
    if (this.isLoading) {
      return;
    }
    let params: {[p:string]: string} = {};
    if (this.earliestDate) {
      params['date'] = this.earliestDate;
    }
    this.isLoading = true;
    this.apiExamService.getList(params)
      .subscribe((res: ExamList) => {
        let numItems = res.items ? res.items.length : 0;
        if (numItems > 0) {
          this.hasMore = true;
          this.earliestDate = res.items[numItems-1].date;
          this.exams = this.exams.concat(res.items);
        }
        else {
          this.hasMore = false;
        }
        this.isLoading = false;
      });
  }

  changeDate(date:string) {
    this.router.navigate([{outlets: {date: ['/', date]}}]);
  }
};
