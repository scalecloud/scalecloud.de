import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { LogService } from 'src/app/core/logging/log.service';
import { BillingPortalService } from './billing-portal.service';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Auth } from 'src/app/core/auth/auth';

@Component({
    selector: 'app-billing-portal',
    templateUrl: './billing-portal.component.html',
    styleUrls: ['./billing-portal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardTitle, MatCardSubtitle, MatDivider, MatCardContent, MatList, MatListItem, MatIcon, MatCardActions, MatButton]
})
export class BillingPortalComponent {
  private readonly auth = inject(Auth);
  private readonly billingPortalService = inject(BillingPortalService);
  private readonly logService = inject(LogService);

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
