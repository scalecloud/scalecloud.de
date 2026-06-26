import { inject, NgZone } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const ngZone = inject(NgZone);

  if (await authService.isLoggedIn(true)) {
    ngZone.run(() => {
      router.navigate(['/dashboard']);
    });
    return false;
  }
  else if (await authService.isLoggedInNotVerified(true)) {
    ngZone.run(() => {
      router.navigate(['/verify-email-address']);
    });
    return false;
  }

  return true;
}
