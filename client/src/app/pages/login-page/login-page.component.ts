import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  ToastModule,
  ToasterService,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    GridModule,
    CardModule,
    FormModule,
    CommonModule,
    ButtonModule,
    IconModule,
    ReactiveFormsModule,
    RouterLink,ToastModule
  ],
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
        Validators.minLength(6),
      ]),
    });

    this.route.queryParams.subscribe({
      next: (params: Params) => {
        if (params['registered']) {
          console.log('You can now log in using your registration details');
        } else if (params['accessDenied']) {
          console.log('You need to log in');
        } else if (params['tokenExpired']) {
          console.log('The session time has expired. Please log in again');
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
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}
