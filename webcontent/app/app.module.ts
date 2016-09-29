import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import { ApiErrorComponent }  from './api-error.component';
import { PageNotFoundComponent }  from './page-not-found.component';

import { routing, appRoutingProviders} from './app.routing';
import { QuestionsModule }  from './questions/questions.module';

import { ApiExamService }  from './common/services/api-exam.service';
import { ApiFailsService }  from './common/services/api-fails.service';
import { ApiErrorService }  from './common/services/api-error.service';
import { RouteExamService }  from './common/services/route-exam.service';
import { RouteDateService }  from './common/services/route-date.service';

@NgModule({
  imports: [ BrowserModule, HttpModule, routing, QuestionsModule ],
  declarations: [ AppComponent, PageNotFoundComponent, ApiErrorComponent ],
  providers: [ ApiExamService, ApiFailsService, ApiErrorService, RouteExamService, RouteDateService, appRoutingProviders ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
