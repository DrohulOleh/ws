import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  emailConfirmed: boolean = false;
  formEditProfile: FormGroup | any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.formEditProfile = new FormGroup({
      profileName: new FormControl(null, [Validators.required]),
      profileEmail: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      profilePassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      profileNewPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      profileNewPasswordConfirm: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      profilDeliveryAddress: new FormControl(null, [Validators.required]),
    });
  }

  ngOnDestroy(): void {}
}
