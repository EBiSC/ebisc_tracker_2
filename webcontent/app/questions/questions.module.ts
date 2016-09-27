import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionDetailComponent }  from './question-detail.component';
import { questionsRouting } from './questions.routing';

@NgModule({
  imports: [ CommonModule, questionsRouting ],
  declarations: [ QuestionDetailComponent ],
})
export class QuestionsModule { };
