import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CellLineListComponent } from './cell-line-list.component';
import { CellLineDetailComponent } from './cell-line-detail.component';
import { DateComponent } from '../core/components/date.component';
import { DateResolver } from '../core/services/date-resolver.service';

const cellLinesRoutes: Routes = [
  { path: 'd', component: DateComponent, resolve: {date: DateResolver}, children: [
    {path: 'cell-line', redirectTo: 'cell-lines'},
    {path: 'cell-lines', data: {breadcrumb: "Cell lines"}, children: [
      {path: '', component: CellLineListComponent},
      {path: ':cellLine', component: CellLineDetailComponent},
    ]},
  ]},
];

export const cellLinesRoutingProviders: any[] = [];

export const cellLinesRouting: ModuleWithProviders = RouterModule.forChild(cellLinesRoutes);
