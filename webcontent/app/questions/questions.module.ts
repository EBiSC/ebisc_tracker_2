import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { QuestionDetailComponent }  from './question-detail.component';
import { QuestionDetailWrapperComponent }  from './question-detail-wrapper.component';
import { QuestionListComponent }  from './question-list.component';
import { questionsRouting } from './questions.routing';

@NgModule({
  imports: [ SharedModule, questionsRouting ],
  declarations: [ QuestionDetailComponent, QuestionDetailWrapperComponent, QuestionListComponent ],
})
export class QuestionsModule { };
