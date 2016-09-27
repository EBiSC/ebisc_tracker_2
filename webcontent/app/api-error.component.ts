import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

import { ApiErrorService } from './common/services/api-error.service'

@Component({
    selector: 'api-error',
    templateUrl: './api-error.component.html',
    providers: [ ApiErrorService ]
})
export class ApiErrorComponent implements OnInit{

  errors: string[] = [];

  constructor(
    private apiErrorService: ApiErrorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {};

  ngOnInit(): void {
    this.apiErrorService.getObservable().subscribe((error:string) => this.errors.push(error));
    return;
  };

  refresh(): void {
    this.dismiss();
    this.router.navigateByUrl(this.activatedRoute.snapshot.toString(), {replaceUrl: true});
    return;
  };

  dismiss(): void {
    this.errors = [];
    return;
  }

}
