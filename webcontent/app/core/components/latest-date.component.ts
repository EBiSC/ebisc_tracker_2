import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouteDateService } from '../services/route-date.service';
import { ApiExamService } from '../services/api-exam.service';

@Component({ 
    template: `<p>LATEST DATE</p>`,
})
export class LatestDateComponent implements OnInit, OnDestroy{
  
  constructor(
    private routeDateService: RouteDateService,
    private apiExamService: ApiExamService,
  ){ };

  ngOnInit() {
      console.log("on init");
      this.apiExamService.getLatestExam().subscribe((exam: {date: string}) => {
        this.routeDateService.nextDate(exam.date)
      });
  }

  ngOnDestroy() {
    console.log("on destroy");
  }

};
