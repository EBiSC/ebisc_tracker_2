import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'prettyDate' })
export class PrettyDatePipe implements PipeTransform {

  reT = new RegExp('T');
  reSuffix = new RegExp('\..*');

  transform(date: string): string {
    console.log('here');
    return date ? date.replace(this.reT, "").replace(this.reSuffix, "") : null;
  }
}
