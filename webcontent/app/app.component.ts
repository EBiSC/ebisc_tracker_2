import { Component, OnInit } from '@angular/core';
import { ApiService} from './api.service'

@Component({
    selector: 'my-app',
    templateUrl: './api.component.html',
    providers: [ ApiService ]
})
export class AppComponent implements OnInit{ 
  error: string;
  exam: {[key:string]: any} = {};

  constructor( private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getExam('latest')
      .subscribe(
        exam => this.exam = exam,
        err => this.error = err.message
      );
  }
}
