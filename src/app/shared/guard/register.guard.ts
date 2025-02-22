import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterGuard {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly ngZone: NgZone
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    let canActivate = true;

    if (await this.authService.isLoggedIn(true)) {
      this.ngZone.run(() => {
        this.router.navigate(['/dashboard']);
      });
      canActivate = false; // Prevent navigation to the current route because we're redirecting.
    }
    else if (await this.authService.isLoggedInNotVerified(true)) {
      this.ngZone.run(() => {
        this.router.navigate(['/verify-email-address']);
      });
      canActivate = false; // Prevent navigation to the current route because we're redirecting.
    }

    return canActivate; // Single point of return
  }

}
