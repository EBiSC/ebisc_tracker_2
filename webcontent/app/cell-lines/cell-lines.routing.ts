import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CellLineListComponent } from './cell-line-list.component';
import { CellLineDetailComponent } from './cell-line-detail.component';

const cellLinesRoutes: Routes = [
  {path: 'cell-line', redirectTo: 'cell-lines'},
  {path: 'cell-lines', data: {breadcrumb: "Cell lines"}, children: [
    {path: '', component: CellLineListComponent},
    {path: ':cellLine', component: CellLineDetailComponent},
  ]},
];

export const cellLinesRoutingProviders: any[] = [];

export const cellLinesRouting: ModuleWithProviders = RouterModule.forChild(cellLinesRoutes);
