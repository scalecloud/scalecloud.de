import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '../auth';

export const dashboardGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);

  if (await auth.ensureAuthenticated()) {
    return true;
  }

  auth.login(state.url);
  return false;
}