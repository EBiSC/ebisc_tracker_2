import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { ApiErrorComponent }  from './api-error.component';
import { PageNotFoundComponent }  from './page-not-found.component';
import { HomeComponent }  from './home.component';

import { routing, appRoutingProviders} from './app.routing';
import { QuestionsModule }  from './questions/questions.module';
import { CoreModule }  from './core/core.module';

@NgModule({
  imports: [ BrowserModule, CoreModule, routing, QuestionsModule ],
  declarations: [ AppComponent, PageNotFoundComponent, ApiErrorComponent, HomeComponent ],
  providers: [ appRoutingProviders ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
