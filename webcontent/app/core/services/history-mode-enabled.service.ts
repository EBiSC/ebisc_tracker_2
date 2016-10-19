import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ApiExamService } from './api-exam.service';
import { RouteDateService } from '../services/route-date.service';

@Injectable()
export class HistoryModeEnabledService {

  // public properties
  readonly enabled$: Observable<boolean>;

  // private properties
  currentDate: string;
  latestDate: string;
  enabledSource: Subject<boolean>


  constructor(
    private apiExamService: ApiExamService,
    private routeDateService: RouteDateService,
  ) {
    if (apiExamService && routeDateService) {
      this.enabledSource = new Subject<boolean>();
      this.enabled$ = this.enabledSource.asObservable();

      routeDateService.resolvedDate$.subscribe((date: string) => {
        if (date !== this.currentDate) {
          this.currentDate = date;
          this.setEnabled();
        }
      });
      apiExamService.getLatestExam().subscribe((exam: {date: string}) => {
        this.latestDate = exam.date;
        this.setEnabled();
      });
    }
  }

  setEnabled() {
    if (this.currentDate && this.latestDate && (this.currentDate !== this.latestDate)) {
      this.enabledSource.next(true);
    }
    else {
      this.enabledSource.next(false);
    }
  }

};

