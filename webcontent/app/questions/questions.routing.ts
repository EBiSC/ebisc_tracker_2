import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionDetailComponent } from './question-detail.component';
import { QuestionListComponent } from './question-list.component';

const questionsRoutes: Routes = [
  {path: 'questions', component: QuestionListComponent},
  {path: 'question/:qModule', component: QuestionDetailComponent},
];

export const questionsRoutingProviders: any[] = [];

export const questionsRouting: ModuleWithProviders = RouterModule.forChild(questionsRoutes);
