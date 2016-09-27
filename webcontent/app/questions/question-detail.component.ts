import { Component } from '@angular/core';
import { ActivatedRoute, Params } from'@angular/router';

@Component({
    templateUrl: './question-detail.component.html'
})
export class QuestionDetailComponent{

  questionModule: string = null;
  
  constructor(
    private activatedRoute: ActivatedRoute,
  ){};

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      this.questionModule = params['qModule'];
    });
  }
};
