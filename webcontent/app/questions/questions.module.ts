import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionDetailComponent }  from './question-detail.component';
import { QuestionDetailWrapperComponent }  from './question-detail-wrapper.component';
import { QuestionListComponent }  from './question-list.component';
import { questionsRouting } from './questions.routing';

@NgModule({
  imports: [ CommonModule, questionsRouting ],
  declarations: [ QuestionDetailComponent, QuestionDetailWrapperComponent, QuestionListComponent ],
})
export class QuestionsModule { };
