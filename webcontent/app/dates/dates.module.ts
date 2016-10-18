import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { DateChooserComponent } from './date-chooser.component';
import { datesRouting } from './dates.routing';

@NgModule({
  imports: [ SharedModule, datesRouting ],
  declarations: [ DateChooserComponent ],
})
export class DatesModule { };
