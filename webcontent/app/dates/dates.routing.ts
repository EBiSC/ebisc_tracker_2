import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DateChooserComponent } from './date-chooser.component';

const datesRoutes: Routes = [
  {path: 'dates', data: {breadcrumb: "Dates"}, component: DateChooserComponent },
];

export const datesRoutingProviders: any[] = [];

export const datesRouting: ModuleWithProviders = RouterModule.forChild(datesRoutes);
