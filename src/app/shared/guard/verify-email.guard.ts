import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const verifyEMailGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (await authService.isLoggedIn(true)) {
    router.navigate(['/dashboard']);
    return false;
  }
  else if (!(await authService.isLoggedIn(true)) && !(await authService.isLoggedInNotVerified(true))) {
    router.navigate(['/login']);
    return false;
  }

  return true;
}