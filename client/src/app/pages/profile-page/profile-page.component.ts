import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ButtonModule,
  FormModule,
  GridModule,
  ModalModule,
  SpinnerModule,
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, of, switchMap } from 'rxjs';
import { IUser } from '../../shared/classes/types';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ModalModule,
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    SpinnerModule,
    FormModule,
    IconModule,
    GridModule,
  ],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  emailConfirmed = false;
  loading = false;
  formEditProfile: FormGroup | any;
  userProfile: IUser | any;
  profileSubscription!: Subscription;

  blockChangePasswordVISIBLE = false;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formEditProfile = new FormGroup({
      profileName: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[\p{L}'][ \p{L}'-]*[\p{L}]$/u),
      ]),
      profileEmail: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
    });

    this.formEditProfile.disable();

    this.profileSubscription = this.activatedRoute.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            return this.authService.getUserById(params['id']);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.userProfile = user;
            this.formEditProfile.patchValue({
              profileName: user.name,
              profileEmail: user.email,
            });
            this.formEditProfile.enable();
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.formEditProfile.enable();
        },
      });
  }

  onConfirmEmail() {}

  onChangePassword() {
    const validatePasswordMatch = (
      control: AbstractControl
    ): { [key: string]: any } | null => {
      const password = this.formEditProfile?.get('profileNewPassword')
        ?.value as string;
      const passwordConfirm = control.value as string;

      if (password !== passwordConfirm) {
        return { passwordMatch: true };
      }

      return null;
    };

    this.formEditProfile.addControl(
      'profileNewPassword',
      new FormControl(null, [Validators.required, Validators.minLength(6)])
    );
    this.formEditProfile.addControl(
      'profileNewPasswordConfirm',
      new FormControl(null, [Validators.required, validatePasswordMatch])
    );

    this.blockChangePasswordVISIBLE = true;
  }

  onChangePasswordCancel() {
    this.formEditProfile.removeControl('profileNewPassword');
    this.formEditProfile.removeControl('profileNewPasswordConfirm');
    this.blockChangePasswordVISIBLE = false;
  }

  onSubmitEditProfile(): void {
    this.formEditProfile.disable();

    this.userProfile.name = this.formEditProfile.value.profileName;
    this.userProfile.email = this.formEditProfile.value.profileEmail;
    this.userProfile.password = this.formEditProfile.value.profileNewPassword;
    this.userProfile.isRegistrationComplete = true;

    if (this.userProfile._id) {
      this.profileSubscription = this.authService
        .updateUser(this.userProfile)
        .subscribe({
          next: (user) => {
            this.userProfile = user;
            console.log('Cahanges saved');
            this.authService.refreshToken().subscribe(() => {});
            this.formEditProfile.enable();
            this.router.navigate(['/product']);
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  onCancelEditProfile(): void {
    this.router.navigate(['/product']);
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) this.profileSubscription.unsubscribe();
  }
}
