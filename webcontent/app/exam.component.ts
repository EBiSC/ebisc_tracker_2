import { Component, Input } from '@angular/core';

@Component({
    selector: 'tracker-exam',
    templateUrl: './exam.component.html'
})
export class ExamComponent{ 
  @Input() exam: {[key:string]: any}
}
