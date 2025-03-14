import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VerifyEMailGuard {
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    let canActivate = true;

    if (await this.authService.isLoggedIn(true)) {
      this.ngZone.run(() => {
        this.router.navigate(['/dashboard']);
      });
      canActivate = false;
    }
    else if (!(await this.authService.isLoggedIn(true)) && !(await this.authService.isLoggedInNotVerified(true))) {
      this.ngZone.run(() => {
        this.router.navigate(['/login']);
      });
      canActivate = false;
    }

    return canActivate;
  }

}
