import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';

import { of, delay, tap, Observable } from 'rxjs';

export interface LoginUser {
  username: string;
  password: string;
  token?: string; // Optional token property
  roles: string[]; // User roles for authorization
  permissions: string[]; // User permissions
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  apiUrl = 'http://localhost:3000/authenticate';
  currentUser = signal<LoginUser | null>(null);

  isAuthenticated = computed(() => !!this.currentUser());

  constructor(private http: HttpClient) {
    const savedUserSession = localStorage.getItem('user_session');

    if (savedUserSession) {
      try {
        // Convert the string back into a real JavaScript object and update the Signal
        this.currentUser.set(JSON.parse(savedUserSession));
      } catch (error) {
        // Fallback if the localStorage data somehow gets corrupted
        this.logout();
      }
    }
  }

  // User Login Method
  loginUser(credentials: {
    username: string;
    password: string;
  }): Observable<any> {
    const dummyUser: LoginUser = {
      username: credentials.username,
      password: credentials.password,
      token: 'fake-jwt-token-456',
      roles: credentials.username === 'admin' ? ['admin'] : ['user'],
      permissions:
        credentials.username === 'admin'
          ? ['can_search', 'edit_user']
          : ['edit_user'],
    };

    // Return dummy data as an observable with a 1-second delay
    return of(dummyUser).pipe(
      delay(1000),
      tap((user) => {
        this.currentUser.set(user);
        localStorage.setItem('token', user.token || '');
        localStorage.setItem('user_session', JSON.stringify(user));
      }),
    );
  }
  hasRole(allowedRoles: string[]): boolean {
    const user = this.currentUser();
    if (!user || !user.roles) return false;
    return allowedRoles.some((role) => user.roles.includes(role));
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
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
    localStorage.removeItem('user_session');
    this.currentUser.set(null);
  }
}
