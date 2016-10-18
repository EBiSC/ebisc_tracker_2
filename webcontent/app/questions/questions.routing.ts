import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionDetailWrapperComponent } from './question-detail-wrapper.component';
import { QuestionListComponent } from './question-list.component';
import { DateResolver } from '../core/services/date-resolver.service';

const questionsRoutes: Routes = [
  {path: 'question', redirectTo: 'questions'},
  {path: 'questions', data: {breadcrumb: "Questions"}, children: [
    {path: '', component: QuestionListComponent, resolve: {date: DateResolver}},
    {path: ':qModule', component: QuestionDetailWrapperComponent, resolve: {date: DateResolver}},
  ]},
];

export const questionsRoutingProviders: any[] = [];

export const questionsRouting: ModuleWithProviders = RouterModule.forChild(questionsRoutes);
