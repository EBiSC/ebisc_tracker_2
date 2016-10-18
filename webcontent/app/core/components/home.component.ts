import { Component } from '@angular/core';

import { RouteDateService } from '../services/route-date.service';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['../../shared/css/shared.css'],
})
export class HomeComponent{ 
  constructor(
    private routeDateService: RouteDateService,
  ){ };

  linkParams(): {[s:string]: string} {
    return this.routeDateService.linkParams({});
  }
};
