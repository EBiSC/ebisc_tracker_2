import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CellLineListComponent } from './cell-line-list.component';
import { CellLineDetailComponent } from './cell-line-detail.component';
import { PrimaryOutletComponent } from '../core/components/primary-outlet.component';

const cellLinesRoutes: Routes = [
  { path: '', component: PrimaryOutletComponent, children: [
    {path: 'cell-line', redirectTo: 'cell-lines'},
    {path: 'cell-lines', data: {breadcrumb: "Cell lines"}, children: [
      {path: '', component: CellLineListComponent},
      {path: ':cellLine', component: CellLineDetailComponent},
    ]},
  ]},
];

export const cellLinesRoutingProviders: any[] = [];

export const cellLinesRouting: ModuleWithProviders = RouterModule.forChild(cellLinesRoutes);
