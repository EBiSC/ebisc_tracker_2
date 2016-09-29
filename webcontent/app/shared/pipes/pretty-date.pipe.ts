import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'prettyDate' })
export class PrettyDatePipe implements PipeTransform {

  reT = /T/;
  reSuffix = /\..*/;

  transform(date: string): string {
    return date ? date.replace(this.reT, " ").replace(this.reSuffix, "") : null;
  }
}
