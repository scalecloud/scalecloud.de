import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../auth';

export const dashboardGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (await auth.isLoggedInNotVerified(true)) {
    router.navigate(['/verify-email-address']);
    return false;
  }
  else if (!(await auth.isLoggedIn(true))) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  return true;
}