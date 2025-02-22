import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LogService } from '../services/log/log.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutGuard {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly ngZone: NgZone,
    private readonly logService: LogService,
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    let canActivate = true;

    if (await this.authService.isLoggedInNotVerified(true)) {
      this.ngZone.run(() => {
        this.router.navigate(['/verify-email-address']);
      });
      canActivate = false; // Prevent navigation to the current route because we're redirecting.
    }
    else if (!(await this.authService.isLoggedIn(true))) {
      this.logService.log('CheckoutGuard: canActivate: User is not logged in. Redirecting to login page.');
      this.ngZone.run(() => {
        this.router.navigate(['/register'], { queryParams: { returnUrl: state.url } });
      });
      canActivate = false; // Prevent navigation to the current route because we're redirecting.
    }

    return canActivate; // Single point of return
  }

}
