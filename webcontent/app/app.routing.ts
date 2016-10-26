import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './core/components/page-not-found.component';
import { DateComponent } from './core/components/date.component';
import { HomeComponent } from './core/components/home.component';
import { DateResolver } from './core/services/date-resolver.service';

const appRoutes: Routes = [
  { path: 'd', component: DateComponent, resolve: {date: DateResolver}, children: [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: HomeComponent },
    { path: '**', component: PageNotFoundComponent },
  ]},
  { path: '', pathMatch: 'prefix', redirectTo: 'd' },
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
