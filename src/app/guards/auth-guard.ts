import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthService);
  const isAuthenticated = service.isAuthenticated();
  if (!isAuthenticated) {
    service.redirectToLogin();
  }
  console.log("Auth Guard - isAuthenticated:", isAuthenticated);
  return isAuthenticated;
}