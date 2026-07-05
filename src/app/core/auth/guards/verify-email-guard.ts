import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../auth';

export const verifyEmailGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (await auth.isLoggedIn(true)) {
    router.navigate(['/dashboard']);
    return false;
  }
  else if (!(await auth.isLoggedIn(true)) && !(await auth.isLoggedInNotVerified(true))) {
    router.navigate(['/login']);
    return false;
  }

  return true;
}