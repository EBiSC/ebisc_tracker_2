import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CellLineListComponent } from './cell-line-list.component';
import { CellLineDetailComponent } from './cell-line-detail.component';

const cellLinesRoutes: Routes = [
  {path: 'cell-lines', component: CellLineListComponent},
  {path: 'cell-line/:cellLine', component: CellLineDetailComponent},
];

export const cellLinesRoutingProviders: any[] = [];

export const cellLinesRouting: ModuleWithProviders = RouterModule.forChild(cellLinesRoutes);
