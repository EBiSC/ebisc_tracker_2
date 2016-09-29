import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { CellLineListComponent }  from './cell-line-list.component';
import { cellLinesRouting } from './cell-lines.routing';

@NgModule({
  imports: [ SharedModule, cellLinesRouting ],
  declarations: [ CellLineListComponent ],
})
export class CellLinesModule { };
