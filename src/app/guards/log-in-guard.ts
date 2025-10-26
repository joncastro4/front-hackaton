import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const logInGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthService);
  const isAuthenticated = service.isAuthenticated();
  if (isAuthenticated) {
    service.redirectToDashboard();
  }
  return !isAuthenticated;
};
