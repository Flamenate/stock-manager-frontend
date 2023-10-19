import { Injectable } from '@angular/core';
import axios from 'axios';
import { SignInDto } from './auth.service';
import { PartialCompany } from './company.service';

type BaseUser = { name: string; email: string; phone: string };

export type LoggedInUser = BaseUser & {
  _id: string;
  access_token: string;
};

export type User = Omit<LoggedInUser, 'access_token'>;

export type NewUser = BaseUser & {
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'http://127.0.0.1';

  constructor() {}

  async getUsersById(ids: string[]): Promise<User[]> {
    const response = await axios.get<User[]>(
      `${this.url}/users?ids=${encodeURI(JSON.stringify({ ids }))}`
    );
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await axios.get<User>(`${this.url}/users/${id}`);
    return response.data;
  }

  async registerNewUser(user: NewUser): Promise<SignInDto> {
    await axios.post<LoggedInUser>(`${this.url}/users`, user);
    return { email: user.email, password: user.password };
  }

  async getUserCompanies(userId: string): Promise<PartialCompany[]> {
    const response = await axios.get<PartialCompany[]>(
      `${this.url}/users/${userId}/companies`
    );
    return response.data;
  }
}
