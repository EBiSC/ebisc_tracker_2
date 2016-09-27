import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import { routing, appRoutingProviders} from './app.routing';
import { QuestionsModule }  from './questions/questions.module';
import { PageNotFoundComponent }  from './page-not-found.component';
import { ApiExamService }  from './common/services/api-exam.service';
import { DateResolveService }  from './common/services/date-resolve.service';

@NgModule({
  imports: [ BrowserModule, HttpModule, routing, QuestionsModule ],
  declarations: [ AppComponent, PageNotFoundComponent ],
  providers: [ ApiExamService, DateResolveService, appRoutingProviders ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
