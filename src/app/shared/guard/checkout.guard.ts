import { inject, NgZone } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LogService } from '../services/log/log.service';

export const checkoutGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const ngZone = inject(NgZone);
  const logService = inject(LogService);

  if (await authService.isLoggedInNotVerified(true)) {
    ngZone.run(() => {
      router.navigate(['/verify-email-address']);
    });
    return false;
  }
  else if (!(await authService.isLoggedIn(true))) {
    logService.log('CheckoutGuard: canActivate: User is not logged in. Redirecting to login page.');
    ngZone.run(() => {
      router.navigate(['/register'], { queryParams: { returnUrl: state.url } });
    });
    return false;
  }

  return true;
}
