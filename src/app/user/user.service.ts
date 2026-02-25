import { User } from './user.model';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [];
  apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  addUser(user: User) {
    return this.http.post<User>(this.apiUrl, user);
  }

  getAllUsers() {
    return this.http.get(this.apiUrl);
  }

  GetUserById(id: string) {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(index: number, user: User) {
    return this.http.put(`${this.apiUrl}/${index}`, user);
  }
  deleteUser(index: number) {
    return this.http.delete(`${this.apiUrl}/${index}`);
  }
}
