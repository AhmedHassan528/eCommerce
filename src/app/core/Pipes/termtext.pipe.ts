import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'termtext',
  standalone: true
})
export class TermtextPipe implements PipeTransform {

  transform(value: string, limt:number): string {

    return value.split(' ', limt).join(' ');
  }

}
