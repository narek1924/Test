import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumberRu',
})
export class PhoneNumberRuPipe implements PipeTransform {
  transform(value: string): unknown {
    return (
      '+' +
      value.charAt(0) +
      '(' +
      value.substring(1, 4) +
      ')' +
      ' ' +
      value.slice(4)
    );
  }
}
