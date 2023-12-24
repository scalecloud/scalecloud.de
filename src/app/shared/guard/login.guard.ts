import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard  {

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn === true) {
      this.ngZone.run(() => {
        this.router.navigate(['/dashboard']);
      });
    }
    else if (this.authService.isLoggedInNotVerified === true) {
      this.ngZone.run(() => {
        this.router.navigate(['/verify-email-address']);
      });
    }
    return true;
  }

}
