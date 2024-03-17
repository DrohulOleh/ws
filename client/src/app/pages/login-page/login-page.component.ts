import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  BiComponent,
  provideBi,
  withIcons,
  at,
  lock,
} from 'dfx-bootstrap-icons';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [BiComponent, CommonModule, RouterLink, ReactiveFormsModule],
  providers: [provideBi(withIcons({ at, lock }))],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup | any;
  aSub: Subscription | any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });

    this.route.queryParams.subscribe({
      next: (params: Params) => {
        if (params['registered']) {
          console.log('You can now log in using your registration details');
        } else if (params['accessDenied']) {
          console.log('Please, sign in');
        } else if (params['tokenExpired']) {
          console.log('The session time has expired. Please, sign in');
        }
      },
    });
  }

  onSubmit() {
    this.form.disable();

    this.aSub = this.auth.login(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/overview']);
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
}
