import { NgModule, ModuleWithProviders, Optional, SkipSelf }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule }    from '@angular/http';

import { ApiExamService }  from './services/api-exam.service';
import { ApiFailsService }  from './services/api-fails.service';
import { ApiLineFailsService }  from './services/api-line-fails.service';
import { ApiErrorService }  from './services/api-error.service';
import { RouteExamService }  from './services/route-exam.service';
import { RouteDateService }  from './services/route-date.service';

@NgModule({
  imports: [ CommonModule ],
  providers: [ ApiExamService, ApiLineFailsService, ApiFailsService, ApiErrorService, RouteExamService, RouteDateService ],
})
export class CoreModule { }
