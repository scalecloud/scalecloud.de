import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LogService } from '../services/log/log.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterGuard  {
  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private logService: LogService,
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    let canActivate = true;
  
    if (await this.authService.isLoggedIn()) {
      this.ngZone.run(() => {
        this.router.navigate(['/dashboard']);
      });
      canActivate = false; // Prevent navigation to the current route because we're redirecting.
    }
    else if (await this.authService.isLoggedInNotVerified()) {
      this.ngZone.run(() => {
        this.router.navigate(['/verify-email-address']);
      });
      canActivate = false; // Prevent navigation to the current route because we're redirecting.
    }
  
    return canActivate; // Single point of return
  }

}
