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

  //User Login Method
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
      tap((user) => this.currentUser.set(user)),
    );
  }

  //Refresh Token Method
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');

    return of({ token: 'new-fake-jwt-token-789' }).pipe(
      delay(500),
      tap((res) =>
        this.currentUser.update((user) =>
          user ? { ...user, token: res.token } : null,
        ),
      ),
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.currentUser.set(null);
  }
}
