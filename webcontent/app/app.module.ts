import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import { ExamComponent }  from './exam.component';
import { ApiService }  from './api.service';

@NgModule({
  imports: [ BrowserModule, HttpModule ],
  declarations: [ AppComponent, ExamComponent ],
  providers: [ ApiService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
