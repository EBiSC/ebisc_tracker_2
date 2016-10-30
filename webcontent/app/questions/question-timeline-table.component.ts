import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { QuestionTimeline } from '../shared/question-timeline';

@Component({
    selector: 'question-timeline-table',
    templateUrl: './question-timeline-table.component.html',
    styles: [`
      .date-table {
        max-width: 500px;
      }
      a.clickable:hover {cursor: pointer; text-decoration: underline;}
    `]
})
export class QuestionTimelineTableComponent {
  @Input() qTimeline: QuestionTimeline;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ){ };

  changeDate(date:string) {
    let urlTree = this.router.createUrlTree([{outlets:{date:date}}]);
    this.router.navigateByUrl(urlTree, {relativeTo: this.activatedRoute});
  }
};
