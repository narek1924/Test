import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumberRu',
})
export class PhoneNumberRuPipe implements PipeTransform {
  transform(value: number): unknown {
    let phoneNum = value.toString();
    return (
      '+' +
      phoneNum.charAt(0) +
      '(' +
      phoneNum.substring(1, 4) +
      ')' +
      ' ' +
      phoneNum.slice(4)
    );
  }
}
