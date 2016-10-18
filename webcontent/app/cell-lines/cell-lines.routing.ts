import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CellLineListComponent } from './cell-line-list.component';
import { CellLineDetailComponent } from './cell-line-detail.component';
import { DateResolver } from '../core/services/date-resolver.service';

const cellLinesRoutes: Routes = [
  {path: 'cell-lines', component: CellLineListComponent, resolve: {date: DateResolver}},
  {path: 'cell-line/:cellLine', component: CellLineDetailComponent, resolve: {date: DateResolver}},
];

export const cellLinesRoutingProviders: any[] = [];

export const cellLinesRouting: ModuleWithProviders = RouterModule.forChild(cellLinesRoutes);
