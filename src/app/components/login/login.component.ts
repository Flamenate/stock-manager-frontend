import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  authService: AuthService = inject(AuthService);
  cookieService: CookieService = inject(CookieService);

  accessDenied: boolean = false;

  get email() {
    return this.loginForm.get('email')!;
  }
  get password() {
    return this.loginForm.get('password')!;
  }

  isSubmitting: boolean = false;
  get canSubmit(): boolean {
    return !this.isSubmitting && this.loginForm.valid;
  }

  constructor(private router: Router) {}

  login(): void {
    this.isSubmitting = true;
    this.authService
      .signIn({
        email: this.email.value || '',
        password: this.password.value || '',
      })
      .then((resp) => {
        this.cookieService.set('access_token', resp.access_token);
        this.router.navigate(['/profile']);
      })
      .catch((e) => {
        this.loginForm.reset();
        this.accessDenied = true;
        this.isSubmitting = false;
      });
  }
}
