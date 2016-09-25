import { Component, Input } from '@angular/core';

@Component({
    selector: 'tracker-exam',
    template: '<h1>{{exam["date"]}}</h1>'
})
export class ExamComponent{ 
  @Input() exam: {[key:string]: any}
}
