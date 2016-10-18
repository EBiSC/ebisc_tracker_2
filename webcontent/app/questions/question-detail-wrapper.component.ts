import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from'@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ApiExamService } from '../core/services/api-exam.service';
import { Exam } from '../shared/exam';

@Component({
    templateUrl: './question-detail-wrapper.component.html',
})
export class QuestionDetailWrapperComponent implements OnInit, OnDestroy{

  // public properties
  questionModule: string = null;
  date: string = null;
  exam: Exam;

  // private properties
  private routeSubscription: Subscription = null;
  private examSource: Subject<Observable<Exam>>;
  private examSubscription: Subscription = null;
  
  constructor(
    private apiExamService: ApiExamService,
    private activatedRoute: ActivatedRoute,
  ){};

  ngOnInit() {
    this.examSource = new Subject<Observable<Exam>>();
    this.examSubscription = this.examSource
        .switchMap((o: Observable<Exam>):Observable<Exam> => o)
        .subscribe((e:Exam) => this.exam = e );
    this.routeSubscription =
      this.activatedRoute.params.subscribe((params: {qModule: string}) => {
        this.date = this.activatedRoute.snapshot.data["date"];
        this.questionModule = params.qModule;
        this.examSource.next(this.apiExamService.getExam(this.date));
      });
  };

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.examSubscription) {
      this.examSubscription.unsubscribe();
    }
  }
};
