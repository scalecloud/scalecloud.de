import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard {
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone
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
      this.ngZone.run(() => {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      });
      canActivate = false; // Prevent navigation to the current route because we're redirecting.
    }

    return canActivate; // Single point of return
  }

}
