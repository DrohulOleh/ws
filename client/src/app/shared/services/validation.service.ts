import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  errorMessages: any;
  formRules = {
    userName: `^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)`,
  };
  formErrors = { userName: '', confirmPassword: '' };

  constructor() {
    this.errorMessages = {
      userName: {
        pattern: `The username must contain a first and last name, for example 'John Doe'`,
      },
      confirmPassword: {
        required: 'Password confirmation is required',
        passwordMismatch: 'Passwords must match',
      },
    };
  }
}
