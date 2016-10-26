import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DateComponent } from '../core/components/date.component';
import { DateChooserComponent } from './date-chooser.component';
import { DateResolver } from '../core/services/date-resolver.service';

const datesRoutes: Routes = [
  { path: 'd', component: DateComponent, resolve: {date: DateResolver}, children: [
    {path: 'dates', data: {breadcrumb: "Dates"}, component: DateChooserComponent },
  ]},
];

export const datesRoutingProviders: any[] = [];

export const datesRouting: ModuleWithProviders = RouterModule.forChild(datesRoutes);
