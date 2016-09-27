import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import { ExamComponent }  from './exam.component';
import { ApiExamService }  from './common/services/api-exam.service';
import { DateResolveService }  from './common/services/date-resolve.service';

@NgModule({
  imports: [ BrowserModule, HttpModule ],
  declarations: [ AppComponent, ExamComponent ],
  providers: [ ApiExamService, DateResolveService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
