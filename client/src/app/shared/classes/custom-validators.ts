import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const passwordMatch: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  let password = control.get('password');
  let confirmPassword = control.get('confirmPassword');

  if (
    password &&
    confirmPassword &&
    password?.value != confirmPassword?.value
  ) {
    return { passwordMatchError: true };
  }

  return null;
};
