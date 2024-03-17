import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  BiComponent,
  provideBi,
  withIcons,
  at,
  lock,
} from 'dfx-bootstrap-icons';
import { Subscription } from 'rxjs';
import { passwordMatch } from '../../shared/classes/custom-validators';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [BiComponent, CommonModule, RouterLink, ReactiveFormsModule],
  providers: [provideBi(withIcons({ at, lock }))],
  templateUrl: './registration-page.component.html',
})
export class RegistrationPageComponent implements OnInit, OnDestroy {
  form: FormGroup | any;
  aSub: Subscription | any;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl(null, [Validators.required]),
      },
      { validators: passwordMatch }
    );
  }

  onSubmit() {
    this.form.disable();

    this.aSub = this.auth.registration(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/login'], {
          queryParams: {
            registered: true,
          },
        });
      },
      error: (err) => {
        console.warn(err.error.message);
        this.form.enable();
      },
    });
  }

  ngOnDestroy(): void {
    if (this.aSub) this.aSub.unsubscribe();
  }

  hideShowPassword() {}
}
