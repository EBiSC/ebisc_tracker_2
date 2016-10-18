import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';

import { routing, appRoutingProviders} from './app.routing';
import { QuestionsModule }  from './questions/questions.module';
import { CellLinesModule }  from './cell-lines/cell-lines.module';
import { CoreModule }  from './core/core.module';
import { SharedModule }  from './shared/shared.module';
import { ApiErrorComponent }  from './core/components/api-error.component';

@NgModule({
  imports: [ BrowserModule, CoreModule, routing, QuestionsModule, CellLinesModule, SharedModule ],
  declarations: [ AppComponent ],
  providers: [ appRoutingProviders ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
