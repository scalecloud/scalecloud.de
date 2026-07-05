import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';

export const checkoutGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const log = inject(Log);

  if (await auth.isLoggedInNotVerified(true)) {
    router.navigate(['/verify-email-address']);
    return false;
  }
  else if (!(await auth.isLoggedIn(true))) {
    log.log('CheckoutGuard: canActivate: User is not logged in. Redirecting to login page.');
    router.navigate(['/register'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  return true;
}