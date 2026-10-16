import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '../../../../core/auth/auth';

export const checkoutGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(Auth);

  if (await auth.ensureAuthenticated()) {
    return true;
  }

  auth.login(state.url);
  return false;
};