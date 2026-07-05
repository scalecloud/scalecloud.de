import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../auth';

export const forgotPasswordGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (await auth.isLoggedIn(true)) {
    router.navigate(['/dashboard']);
    return false;
  }
  else if (await auth.isLoggedInNotVerified(true)) {
    router.navigate(['/verify-email-address']);
    return false;
  }

  return true;
}