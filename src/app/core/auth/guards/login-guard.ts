import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../auth';

export const loginGuard: CanActivateFn = async (route, _state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const target = auth.resolveReturnTarget(route.queryParamMap.get('returnUrl'));

  if (await auth.ensureAuthenticated()) {
    return router.parseUrl(target);
  }

  auth.login(target);
  return false;
};