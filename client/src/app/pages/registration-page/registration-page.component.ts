import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { Subscription } from 'rxjs';
import { ValidationService } from '../../shared/services/validation.service';
import { AuthService } from '../../shared/services/auth.service';

export class PasswordValidators {
  static confirmPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password?.valid && password?.value === confirmPassword?.value) {
      confirmPassword?.setErrors(null);
      return null;
    }

    confirmPassword?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
}

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    FormModule,
    GridModule,
    IconModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './registration-page.component.html',
})
export class RegistrationPageComponent implements OnInit, OnDestroy {
  form!: FormGroup | any;
  aSub!: Subscription | any;
  formErrors: any;

  constructor(
    public validatonService: ValidationService,
    private router: Router,
    private auth: AuthService
  ) {
    this.formErrors = validatonService.errorMessages;
  }

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmPassword: new FormControl(null, [Validators.required]),
      },
      { validators: [PasswordValidators.confirmPassword] }
    );
  }

  onSubmit(): void {
    this.form.disable();

    this.aSub = this.auth.registration(this.form.value).subscribe({
      next: (v) => {
        this.router.navigate(['/login'], {
          queryParams: { registered: true },
        });
      },
      error: (err) => {
        console.warn(err.error.message);
        this.form.enable();
      },
      //complete: this.form.enable(),
    });
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}
