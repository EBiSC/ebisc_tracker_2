import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './core/components/page-not-found.component';
import { DateOutletComponent } from './core/components/date-outlet.component';
import { PrimaryOutletComponent } from './core/components/primary-outlet.component';
import { HomeComponent } from './core/components/home.component';
import { DateResolver } from './core/services/date-resolver.service';

const appRoutes: Routes = [

  { outlet: 'date', path: '', pathMatch: 'full', component: DateOutletComponent },
  { outlet: 'date', path: ':date', component: DateOutletComponent },
  { outlet: 'date', path: '**', redirectTo: '' },

  { path: '', component: PrimaryOutletComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: HomeComponent , data: {breadcrumb: "Home"}},
    { path: '**', component: PageNotFoundComponent },
  ]},

];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
