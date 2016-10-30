import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { QuestionDetailComponent }  from './question-detail.component';
import { QuestionDetailOutletComponent }  from './question-detail-outlet.component';
import { QuestionDetailEmbeddedComponent }  from './question-detail-embedded.component';
import { QuestionListComponent }  from './question-list.component';
import { QuestionTimelineTableComponent }  from './question-timeline-table.component';
import { QuestionTimelineChartDirective }  from './question-timeline-chart.directive';
import { questionsRouting } from './questions.routing';

@NgModule({
  imports: [ SharedModule, questionsRouting ],
  declarations: [ QuestionDetailComponent, QuestionDetailOutletComponent, QuestionDetailEmbeddedComponent, QuestionListComponent, QuestionTimelineTableComponent, QuestionTimelineChartDirective ],
})
export class QuestionsModule { };
