import { User } from './user.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  nextId: number = 0;
  apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  addUser(user: User) {
    return this.getLatestId().pipe(
      switchMap((latestId) => {
        const nextId = latestId + 1;
        const userWithId = { ...user, id: nextId.toString() };

        return this.http.post<User>(this.apiUrl, userWithId);
      }),
    );
  }

  getAllUsers() {
    return this.http.get(this.apiUrl);
  }

  getLatestId() {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users) => {
        if (!users || users.length === 0) return 0;

        // Convert string IDs to Numbers to find the maximum
        return users.reduce((max, user) => {
          const currentId = Number(user.id);
          return currentId > max ? currentId : max;
        }, 0);
      }),
    );
    /* return this.http.get<User[]>(this.apiUrl).pipe(
      map((users) => {
        if (!users || users.length === 0) return 0;

        return users.reduce((max, user) => {
          const currentId = Number(user.id);
          return currentId > max ? currentId : max;
        }, 0);
      }),
    );*/

    // to get 1 record, sorted by id descending
    // return this.http
    // .get<User[]>(`${this.apiUrl}?_sort=id&_order=desc&_limit=1`)
    // .pipe(map((users) => (users.length > 0 ? Number(users[0].id) : 0)));
  }

  GetUserById(id: number) {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, user: User) {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number) {
    //const stringId = id.toString();
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
