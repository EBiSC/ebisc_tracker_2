import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found.component';
import { HomeComponent } from './home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent },
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
