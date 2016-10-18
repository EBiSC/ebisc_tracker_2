import { Component } from '@angular/core';

import { RouteDateService } from '../services/route-date.service';
import { sharedStyles } from '../../shared/styles/shared.styles';

@Component({
    templateUrl: './home.component.html',
    styles: [ sharedStyles ],
})
export class HomeComponent{ 
  constructor(
    private routeDateService: RouteDateService,
  ){ };

  linkParams(): {[s:string]: string} {
    return this.routeDateService.linkParams({});
  }
};
