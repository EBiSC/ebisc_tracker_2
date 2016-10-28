import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { QuestionDetailComponent }  from './question-detail.component';
import { QuestionDetailWrapperComponent }  from './question-detail-wrapper.component';
import { QuestionListComponent }  from './question-list.component';
import { QuestionTimelineComponent }  from './question-timeline.component';
import { QuestionTimelineChartDirective }  from './question-timeline-chart.directive';
import { questionsRouting } from './questions.routing';

@NgModule({
  imports: [ SharedModule, questionsRouting ],
  declarations: [ QuestionDetailComponent, QuestionDetailWrapperComponent, QuestionListComponent, QuestionTimelineComponent, QuestionTimelineChartDirective ],
})
export class QuestionsModule { };
