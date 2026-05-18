import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  const expectedRoles = route.data['roles'] as string[];
  const expectedPermission = route.data['permission'] as string;

  // Validate Roles
  const hasRole = expectedRoles ? authService.hasRole(expectedRoles) : true;

  // Validate Permissions
  const hasPermission = expectedPermission
    ? authService.hasPermission(expectedPermission)
    : true;

  if (hasRole && hasPermission) {
    return true;
  }

  // Redirect to unauthorized page or homegit

  return router.parseUrl('/unauthorized');
};
