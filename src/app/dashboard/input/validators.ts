import { AbstractControl, ValidationErrors } from '@angular/forms';
export function loginValidator(
  control: AbstractControl
): ValidationErrors | null {
  const loginPattern = /^[a-zA-Z0-9]+$/;

  if (!control.value) {
    return null;
  }

  if (control.value.length < 5 || control.value.length > 20) {
    return {
      length: true,
      message: 'Логин должен содержать от 5 до 20 символов',
    };
  }

  if (!loginPattern.test(control.value)) {
    return {
      pattern: true,
      message: 'Логин должен содержать только латинские буквы и числа',
    };
  }

  return null;
}
export function phoneNumberValidator(
  control: AbstractControl
): ValidationErrors | null {
  const numericPattern = /^[0-9]+$/;

  if (!control.value) {
    return null;
  }

  if (!numericPattern.test(control.value)) {
    return { pattern: true, message: 'Номер должен содержать только числа' };
  }
  if (control.value.length < 8) {
    return { length: true, message: 'Номер слишком короткий' };
  }

  return null;
}
export function emailValidator(
  control: AbstractControl
): ValidationErrors | null {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!control.value) {
    return null; // No validation error if the field is empty
  }

  if (!emailPattern.test(control.value)) {
    return { pattern: true, message: 'Неправильный e-mail адрес' };
  }

  return null; // No validation error if the input is a valid email
}
