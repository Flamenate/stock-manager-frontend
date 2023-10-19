import { Injectable, inject } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import { LoggedInUser } from './user.service';
import jwt_decode, { JwtPayload } from 'jwt-decode';

export interface SignInDto {
  email: string;
  password: string;
}

export interface SignInResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://127.0.0.1';

  cookieService: CookieService = inject(CookieService);

  constructor() {}

  isLoggedIn(): boolean {
    const accessToken = this.cookieService.get('access_token');
    return accessToken != '';
  }

  getAuthenticatedUserId(): string {
    if (!this.isLoggedIn()) return '';

    const accessToken = this.cookieService.get('access_token');
    const { sub: userId } = jwt_decode<JwtPayload>(accessToken);
    return userId!;
  }

  async signIn(signInDto: SignInDto): Promise<SignInResponse> {
    const response = await axios.post<LoggedInUser>(
      `${this.url}/auth/login`,
      signInDto
    );
    return response.data;
  }
}
