import { NgModule, ModuleWithProviders, Optional, SkipSelf }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { ApiErrorComponent }  from './components/api-error.component';
import { HistoryWarningComponent }  from './components/history-warning.component';
import { PageNotFoundComponent }  from './components/page-not-found.component';
import { HomeComponent }  from './components/home.component';
import { DateComponent }  from './components/date.component';
import { BreadcrumbsComponent }  from './components/breadcrumbs.component';

import { ApiExamService }  from './services/api-exam.service';
import { ApiFailsService }  from './services/api-fails.service';
import { ApiLineFailsService }  from './services/api-line-fails.service';
import { ApiErrorService }  from './services/api-error.service';
import { ApiQuestionTimelineService }  from './services/api-question-timeline.service';
import { RouteDateService }  from './services/route-date.service';
import { DateResolver }  from './services/date-resolver.service';

@NgModule({
  imports: [ SharedModule, CommonModule, RouterModule ],
  declarations: [ PageNotFoundComponent, HomeComponent, ApiErrorComponent, BreadcrumbsComponent, HistoryWarningComponent, DateComponent ],
  providers: [ ApiExamService, ApiLineFailsService, ApiFailsService, ApiErrorService, ApiQuestionTimelineService, RouteDateService, DateResolver ],
  exports: [ ApiErrorComponent, BreadcrumbsComponent, DateComponent ],
})
export class CoreModule { 
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only')
    }
  }
}
