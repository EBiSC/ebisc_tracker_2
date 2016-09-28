import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import { ApiErrorComponent }  from './api-error.component';
import { PageNotFoundComponent }  from './page-not-found.component';

import { routing, appRoutingProviders} from './app.routing';
import { QuestionsModule }  from './questions/questions.module';

import { ApiExamService }  from './common/services/api-exam.service';
import { ApiErrorService }  from './common/services/api-error.service';
import { ExamObservableService }  from './common/services/exam-observable.service';

@NgModule({
  imports: [ BrowserModule, HttpModule, routing, QuestionsModule ],
  declarations: [ AppComponent, PageNotFoundComponent, ApiErrorComponent ],
  providers: [ ApiExamService, ApiErrorService, ExamObservableService, appRoutingProviders ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
