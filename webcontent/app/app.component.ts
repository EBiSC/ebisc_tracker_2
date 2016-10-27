import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { RouteDateService } from './core/services/route-date.service';

const bodyBackgroundStyles: string = `
  :host(.history-mode) {
    background-color: #FFFFE0;
  }
`

@Component({
    selector: 'body',
    styles: [ bodyBackgroundStyles ],
    host: {"[class.history-mode]": "historyModeEnabled"},
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy{

  historyModeEnabled: boolean = false;

  // private properties
  private latestDateSubscription: Subscription = null;

  constructor(
    private routeDateService: RouteDateService,
  ) {};

  ngOnInit() {
    this.latestDateSubscription =
      this.routeDateService.isLatest$.subscribe((isLatest: boolean) => {
        this.historyModeEnabled = !isLatest;
      });
  }

  ngOnDestroy() {
    if (this.latestDateSubscription) {
      this.latestDateSubscription.unsubscribe();
    }
  }

};
