import { NgModule, ModuleWithProviders, Optional, SkipSelf }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { ApiErrorComponent }  from './components/api-error.component';
import { PageNotFoundComponent }  from './components/page-not-found.component';
import { HomeComponent }  from './components/home.component';
import { BreadcrumbsComponent }  from './components/breadcrumbs.component';

import { ApiExamService }  from './services/api-exam.service';
import { ApiFailsService }  from './services/api-fails.service';
import { ApiLineFailsService }  from './services/api-line-fails.service';
import { ApiErrorService }  from './services/api-error.service';
import { RouteDateService }  from './services/route-date.service';
import { DateResolver }  from './services/date-resolver.service';

@NgModule({
  imports: [ SharedModule, CommonModule, RouterModule ],
  declarations: [ PageNotFoundComponent, HomeComponent, ApiErrorComponent, BreadcrumbsComponent ],
  providers: [ ApiExamService, ApiLineFailsService, ApiFailsService, ApiErrorService, RouteDateService, DateResolver ],
  exports: [ ApiErrorComponent, BreadcrumbsComponent ],
})
export class CoreModule { 
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only')
    }
  }
}
