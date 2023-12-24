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

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn === true) {
      return true;
    }
    else if (this.authService.isLoggedInNotVerified === true) {
      this.ngZone.run(() => {
        this.router.navigate(['/verify-email-address']);
      });
    }
    else if (this.authService.isLoggedIn === false) {
      this.ngZone.run(() => {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      });
    }

    return true;
  }

}
