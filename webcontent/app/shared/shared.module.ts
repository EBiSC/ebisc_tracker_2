import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { PrettyDatePipe } from './pipes/pretty-date.pipe';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ PrettyDatePipe ],
  exports: [ PrettyDatePipe, CommonModule, HttpModule ]
})
export class SharedModule { }
