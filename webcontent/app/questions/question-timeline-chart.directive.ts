import { Directive, OnChanges, SimpleChanges, Input, ElementRef } from '@angular/core';

import { QuestionTimeline } from '../shared/question-timeline';
import { GoogleLoadedService } from '../core/services/google-loaded.service';


@Directive({
    selector: '[qTimelineChart]',
})
export class QuestionTimelineChartDirective implements OnChanges{
  @Input('qTimelineChart') qTimeline: QuestionTimeline;

  private element: any;

  constructor(private elementRef: ElementRef, private googleLoadedService: GoogleLoadedService) {
    this.element = elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.googleLoadedService.isLoaded['timeline']) {
      this.loadChart(this.qTimeline, this.element);
    }
    else {
      this.googleLoadedService.load('timeline');
      let d = this;
      google.charts.setOnLoadCallback(function() {d.loadChart(d.qTimeline, d.element)});
    }
  }

  loadChart(qTimeline: QuestionTimeline, element: any) {
    if (qTimeline) {
      let cols: {type:string, id:string}[] = [
              {type: 'string', id: 'Term'},
              {type: 'string', id: 'Num'},
              {type: 'date', id: 'Start'},
              {type: 'date', id: 'End'}
          ];
      let rows: {c:{v: string|number}[]}[] = [];
      let lastNum : number;
      let firstRow = true;
      qTimeline.items.forEach(qEvent => {
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
      qTimeline.items.forEach(qEvent => {
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
      let timeline = new google.visualization.Timeline(element);
      timeline.draw(dt);
    }
  }

}
