import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionDetailComponent } from './question-detail.component';

const questionsRoutes: Routes = [
  {path: 'question/:qModule', component: QuestionDetailComponent},
];

export const questionsRoutingProviders: any[] = [];

export const questionsRouting: ModuleWithProviders = RouterModule.forChild(questionsRoutes);
