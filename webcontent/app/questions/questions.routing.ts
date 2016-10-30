import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionDetailOutletComponent } from './question-detail-outlet.component';
import { QuestionListComponent } from './question-list.component';
import { PrimaryOutletComponent } from '../core/components/primary-outlet.component';

const questionsRoutes: Routes = [
  { path: '', component: PrimaryOutletComponent, children: [
    {path: 'question', redirectTo: 'questions'},
    {path: 'questions', data: {breadcrumb: "Questions"}, children: [
      {path: '', component: QuestionListComponent},
      {path: ':qModule', component: QuestionDetailOutletComponent},
    ]},
  ]},
];

export const questionsRoutingProviders: any[] = [];

export const questionsRouting: ModuleWithProviders = RouterModule.forChild(questionsRoutes);
