import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiErrorService } from './common/services/api-error.service';
import { ApiErrorHandle } from './common/api-error-handle';

@Component({
    selector: 'api-error',
    templateUrl: './api-error.component.html',
    providers: [ ApiErrorService ]
})
export class ApiErrorComponent implements OnInit{

  errors: ApiErrorHandle[] = [];

  constructor(
    private apiErrorService: ApiErrorService,
    private router: Router,
  ) {};

  ngOnInit(): void {
    this.apiErrorService.getObservable()
        .subscribe((handle:ApiErrorHandle) => this.errors.push(handle));
    this.router.events.subscribe((value:any):void => this.dismiss());
    return;
  };

  retry(): void {
    for (let handle of this.errors) {
      handle.retry();
    }
    this.errors = [];
    return;
  };

  dismiss(): void {
    for (let handle of this.errors) {
      handle.dismiss();
    }
    this.errors = [];
    return;
  }

}
