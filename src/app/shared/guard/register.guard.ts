import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

export const registerGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (await authService.isLoggedIn(true)) {
    router.navigate(['/dashboard']);
    return false;
  }
  else if (await authService.isLoggedInNotVerified(true)) {
    router.navigate(['/verify-email-address']);
    return false;
  }

  return true;
}