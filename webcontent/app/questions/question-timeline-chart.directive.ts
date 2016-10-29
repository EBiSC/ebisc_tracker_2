import { Directive, OnChanges, OnInit, OnDestroy, SimpleChanges, Input, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { QuestionTimeline } from '../shared/question-timeline';
import { GoogleLoadedService } from '../core/services/google-loaded.service';


@Directive({
    selector: '[qTimelineChart]',
})
export class QuestionTimelineChartDirective implements OnChanges, OnInit{
  @Input('qTimelineChart') qTimeline: QuestionTimeline;

  private gLoadedSubscription: Subscription;
  private isLoaded: boolean;

  constructor(
    private elementRef: ElementRef,
    private googleLoadedService: GoogleLoadedService
  ) {}

  ngOnInit() {
    this.googleLoadedService.load('timeline').subscribe((isLoaded: boolean) => {
      this.isLoaded = isLoaded;
      this.loadChart();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadChart();
  }

  ngOnDestroy() {
    if (this.gLoadedSubscription) {
      this.gLoadedSubscription.unsubscribe();
    }
  };

  loadChart() {
    if (this.qTimeline && this.isLoaded ) {
      let cols: {type:string, id:string}[] = [
              {type: 'string', id: 'Term'},
              {type: 'string', id: 'Num'},
              {type: 'date', id: 'Start'},
              {type: 'date', id: 'End'}
          ];
      let rows: {c:{v: string|number}[]}[] = [];
      let lastNum : number;
      let firstRow = true;
      this.qTimeline.items.forEach(qEvent => {
        let qEventDate = Date.parse(qEvent.date);
        if (!firstRow) {
          rows[rows.length -1].c[2].v = qEventDate;
        }
        if (firstRow || lastNum != qEvent.numFailed) {
          rows.push({c:[{v: 'How many failed'}, {v: ""+qEvent.numFailed}, {v: qEventDate}, {v: qEventDate}]});
        }
        lastNum = qEvent.numFailed;
        firstRow = false
      });

      firstRow = true;
      this.qTimeline.items.forEach(qEvent => {
        let qEventDate = Date.parse(qEvent.date);
        if (!firstRow) {
          rows[rows.length -1].c[2].v = qEventDate;
        }
        if (firstRow || lastNum != qEvent.numTested) {
          rows.push({c:[{v: 'How many tested'}, {v: ""+qEvent.numTested}, {v: qEventDate}, {v: qEventDate}]});
        }
        lastNum = qEvent.numTested;
        firstRow = false
      });

      let dt = new google.visualization.DataTable({cols:cols, rows:rows}, 0.6);
      let timeline = new google.visualization.Timeline(this.elementRef.nativeElement);
      timeline.draw(dt);
    }
  }

}
