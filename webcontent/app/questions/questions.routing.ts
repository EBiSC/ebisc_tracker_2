import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionDetailWrapperComponent } from './question-detail-wrapper.component';
import { QuestionListComponent } from './question-list.component';
import { PrimaryOutletComponent } from '../core/components/primary-outlet.component';

const questionsRoutes: Routes = [
  { path: '', component: PrimaryOutletComponent, children: [
    {path: 'question', redirectTo: 'questions'},
    {path: 'questions', data: {breadcrumb: "Questions"}, children: [
      {path: '', component: QuestionListComponent},
      {path: ':qModule', component: QuestionDetailWrapperComponent},
    ]},
  ]},
];

export const questionsRoutingProviders: any[] = [];

export const questionsRouting: ModuleWithProviders = RouterModule.forChild(questionsRoutes);
