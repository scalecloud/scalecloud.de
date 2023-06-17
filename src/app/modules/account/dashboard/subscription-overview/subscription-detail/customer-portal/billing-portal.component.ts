import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { BillingPortalService } from './billing-portal.service';

@Component({
  selector: 'app-billing-portal',
  templateUrl: './billing-portal.component.html',
  styleUrls: ['./billing-portal.component.scss']
})
export class BillingPortalComponent {

  constructor(
    public authService: AuthService,
    private billingPortalService: BillingPortalService,
    private logService: LogService
  ) { }

  openBillingPortal(): void {
    this.billingPortalService.getBillingPortal()
      .subscribe((billingPortal) => {
        if (billingPortal == null) {
          this.logService.error('BillingPortalComponent.openBillingPortal: billingPortal is null');
        } else {
          window.open(billingPortal.url, '_blank');
        }
      }
      );
  }
}
