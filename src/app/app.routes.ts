import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { authGuard } from './auth/auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized/unauthorized.component';
import { canDeactivateGuard } from './auth/can-deactive.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },

      {
        path: 'user',
        loadComponent: () =>
          import('./user/user.component').then((m) => m.UserComponent),
        canActivate: [authGuard],
        data: {
          roles: ['admin', 'user'],
          permission: 'edit_user',
        },
        canDeactivate: [canDeactivateGuard],
        children: [
          {
            path: 'new',
            loadComponent: () =>
              import('./user-dialog/user-dialog.component').then(
                (m) => m.UserDialogComponent,
              ),
            canDeactivate: [canDeactivateGuard],
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./user-dialog/user-dialog.component').then(
                (m) => m.UserDialogComponent,
              ),
            canDeactivate: [canDeactivateGuard],
          },
          {
            path: 'edit',
            loadComponent: () =>
              import('./user-dialog/user-dialog.component').then(
                (m) => m.UserDialogComponent,
              ),
            canDeactivate: [canDeactivateGuard],
          },
        ],
      },

      // {
      //   path: 'userdetails',
      //   loadComponent: () =>
      //     import('./user-details/user-details/user-details.component').then(
      //       (m) => m.UserDetailsComponent,
      //     ),
      //   canDeactivate: [canDeactivateGuard],
      //   // children: [
      //   //   {
      //   //     path: ':id',
      //   //     loadComponent: () =>
      //   //       import('./user-details/user-details/user-details.component').then(
      //   //         (m) => m.UserDetailsComponent,
      //   //       ),
      //   //     canDeactivate: [canDeactivateGuard],
      //   //   },
      //   // ],
      // },

      {
        path: 'new',
        loadComponent: () =>
          import('./new-user/new-user.component').then(
            (m) => m.NewUserComponent,
          ),
      },

      {
        path: 'search',
        loadComponent: () =>
          import('./search/search/search.component').then(
            (m) => m.SearchComponent,
          ),
        canActivate: [authGuard],
        data: {
          roles: ['admin'],
          permission: 'can_search',
        },
        children: [
          {
            path: 'jobSearch',
            loadComponent: () =>
              import('./search/job-search/job-search.component').then(
                (m) => m.JobSearchComponent,
              ),
          },
          {
            path: 'userIdSearch',
            loadComponent: () =>
              import('./search/user-id-search/user-id-search.component').then(
                (m) => m.UserIdSearchComponent,
              ),
          },
          {
            path: 'userSearch',
            loadComponent: () =>
              import('./search/user-search/user-search.component').then(
                (m) => m.UserSearchComponent,
              ),
          },
        ],
      },
    ],
  },

  { path: '**', component: NotFoundComponent },
];
