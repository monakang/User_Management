import {
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  switchMap,
  throwError,
  filter,
  take,
  Observable,
} from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { toObservable } from '@angular/core/rxjs-interop';
// Use a BehaviorSubject to manage the refresh state across multiple simultaneous requests
const isRefreshing$ = new BehaviorSubject<boolean>(false);
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const authService = inject(AuthenticationService);

  // Clone request to header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  //Request to next handler and catch authentication errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/authenticate')) {
        return handle401Error(req, next, authService, router);
      }
      return throwError(() => error);
    }),
  );
};

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthenticationService,
  router: Router,
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing$.value) {
    isRefreshing$.next(true);
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((res: any) => {
        isRefreshing$.next(false);
        localStorage.setItem('token', res.token); // Store new access token
        refreshTokenSubject.next(res.token);

        // Retry the original request with the new token
        return next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${res.token}` },
          }),
        );
      }),
      catchError((err) => {
        isRefreshing$.next(false);
        authService.logout(); // If refresh fails, clear everything
        router.navigate(['/login']);
        return throwError(() => err);
      }),
    );
  } else {
    // If a refresh is already in progress, wait for the new token
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) =>
        next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          }),
        ),
      ),
    );
  }
}
