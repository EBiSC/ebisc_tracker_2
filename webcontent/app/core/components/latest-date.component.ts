import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouteDateService } from '../services/route-date.service';
import { ApiExamService } from '../services/api-exam.service';

@Component({ 
    template: '',
})
export class LatestDateComponent implements OnInit{
  
  constructor(
    private routeDateService: RouteDateService,
    private apiExamService: ApiExamService,
  ){ };

  ngOnInit() {
      this.apiExamService.getLatestExam().subscribe((exam: {date: string}) => {
        this.routeDateService.nextDate(exam.date)
      });
  }

};
