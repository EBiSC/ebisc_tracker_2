import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { HistoryModeEnabledService } from './core/services/history-mode-enabled.service';

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
  private historyEnabledSubscription: Subscription = null;

  constructor(
    private historyModeEnabledService: HistoryModeEnabledService,
  ) {};

  ngOnInit() {
    this.historyEnabledSubscription = this.historyModeEnabledService.enabled$
      .subscribe((enabled: boolean) => this.historyModeEnabled = enabled);
  }

  ngOnDestroy() {
    if (this.historyEnabledSubscription) {
      this.historyEnabledSubscription.unsubscribe();
    }
  }

};
