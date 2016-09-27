import { Component, Input } from '@angular/core';

import { Exam } from './common/exam';

@Component({
    selector: 'tracker-exam',
    templateUrl: './exam.component.html'
})
export class ExamComponent{ 
  @Input() exam: Exam;
}
