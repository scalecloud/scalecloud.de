import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LogService } from 'src/app/core/logging/log.service';

export const checkoutGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const logService = inject(LogService);

  if (await authService.isLoggedInNotVerified(true)) {
    router.navigate(['/verify-email-address']);
    return false;
  }
  else if (!(await authService.isLoggedIn(true))) {
    logService.log('CheckoutGuard: canActivate: User is not logged in. Redirecting to login page.');
    router.navigate(['/register'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  return true;
}