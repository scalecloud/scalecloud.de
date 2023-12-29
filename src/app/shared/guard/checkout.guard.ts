import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ReturnUrlService } from '../services/redirect/return-url.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutGuard {
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedInNotVerified()) {
      this.ngZone.run(() => {
        this.router.navigate(['/verify-email-address']);
      });
    }
    else if (!this.authService.isLoggedIn()) {
      this.ngZone.run(() => {
        this.router.navigate(['/register'], { queryParams: { returnUrl: state.url } });
      });
    }
    return true;
  }

}
