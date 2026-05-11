import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { NewUserComponent } from './new-user/new-user.component';
import { LoginComponent } from './login/login.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { SearchComponent } from './search/search/search.component';
import { JobSearchComponent } from './search/job-search/job-search.component';
import { UserSearchComponent } from './search/user-search/user-search.component';
import { UserIdSearchComponent } from './search/user-id-search/user-id-search.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    //redirectTo: 'user',
    //pathMatch: 'prefix',
  },
  {
    path: 'new',
    component: NewUserComponent,
  },
  // {
  //   path: 'user',
  //   component: UserComponent,
  //   // children: [{ path: 'edit/:id' }],
  // },
  // {
  //   path: 'user',
  //   component: UserComponent,
  //   children: [{ path: 'new', component: NewUserComponent }],
  // },
  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    // children: [{ path: 'edit/:id' }],
  },
  {
    path: 'user',
    component: UserComponent, // Parent (Background)
    children: [
      {
        path: 'new',
        component: UserDialogComponent, // Wrapper (Opener)
      },
    ],
  },
  {
    path: 'user',
    component: UserComponent,
    children: [
      {
        path: 'edit/:id', // e.g., /users/123
        component: UserDialogComponent,
      },
    ],
  },
  {
    path: 'user',
    component: UserComponent,
    children: [
      {
        path: 'edit', // e.g., /users/123
        component: UserDialogComponent,
      },
    ],
  },
  {
    path: 'search',
    component: SearchComponent, // This component holds the <mat-toolbar>
    children: [
      { path: 'jobSearch', component: JobSearchComponent },
      { path: 'userIdSearch', component: UserIdSearchComponent },
      { path: 'userSearch', component: UserSearchComponent },
    ],
  },

  //{ path: '**', component: NotFoundComponent }, // Wildcard  */
];
