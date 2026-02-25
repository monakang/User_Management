import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

import { of, delay, tap, Observable } from 'rxjs';

export interface LoginUser {
  username: string;
  password: string;
  token?: string; // Optional token property
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isAuthenticated = false;
  apiUrl = 'http://localhost:3000/authenticate';
  currentUser = signal<LoginUser | null>(null);

  constructor(private http: HttpClient) {}

  loginUser(LoginUser: {
    username: string;
    password: string;
  }): Observable<any> {
    const dummyUser: LoginUser = {
      username: 'admin',
      password: '123',
      token: 'fake-jwt-token-456',
    };
    // Return dummy data as an observable with a 1-second delay
    return of(dummyUser).pipe(
      delay(1000),
      tap((user) => this.currentUser.set(user)), // Update Signal state
    );
  }
}
