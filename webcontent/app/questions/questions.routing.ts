import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionDetailWrapperComponent } from './question-detail-wrapper.component';
import { QuestionListComponent } from './question-list.component';

const questionsRoutes: Routes = [
  {path: 'questions', component: QuestionListComponent},
  {path: 'question/:qModule', component: QuestionDetailWrapperComponent},
];

export const questionsRoutingProviders: any[] = [];

export const questionsRouting: ModuleWithProviders = RouterModule.forChild(questionsRoutes);
