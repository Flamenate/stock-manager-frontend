import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import {
  AuthService,
  SignInDto,
  SignInResponse,
} from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.minLength(2)]),
    email: new FormControl('', [Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[24579]\d{7}$/),
    ]),
    password: new FormControl('', [Validators.minLength(8)]),
    passwordConfirmation: new FormControl('', [Validators.required]),
  });

  userService: UserService = inject(UserService);
  authService: AuthService = inject(AuthService);
  cookieService: CookieService = inject(CookieService);

  get firstName() {
    return this.registerForm.get('firstName')!;
  }

  get lastName() {
    return this.registerForm.get('lastName')!;
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  get phone() {
    return this.registerForm.get('phone')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  get passwordConfirmation() {
    return this.registerForm.get('passwordConfirmation')!;
  }

  isSubmitting: boolean = false;

  get canSubmit() {
    return (
      !this.isSubmitting &&
      this.registerForm.valid &&
      this.password.value == this.passwordConfirmation.value
    );
  }

  alreadyExists: boolean = false;

  constructor(private router: Router) {}

  registerNewUser(): void {
    this.isSubmitting = true;
    this.userService
      .registerNewUser({
        name: this.firstName.value! + ' ' + this.lastName.value!,
        email: this.email.value!,
        phone: this.phone.value!,
        password: this.password.value!,
      })
      .then((signInDto: SignInDto) => {
        this.authService
          .signIn(signInDto)
          .then((resp: SignInResponse): void => {
            this.cookieService.set('access_token', resp['access_token']);
            this.router.navigate(['/profile']);
          })
          .catch((e) => {
            console.error(e);
            this.router.navigate(['/login']);
          });
      })
      .catch(() => {
        this.alreadyExists = true;
        this.isSubmitting = false;
        this.phone.reset();
        this.email.reset();
      });
  }
}
