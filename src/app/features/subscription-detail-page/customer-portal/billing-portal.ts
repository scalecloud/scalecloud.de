import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { BillingPortalClient } from './billing-portal-client';

@Component({
    selector: 'app-billing-portal',
    templateUrl: './billing-portal.html',
    styleUrls: ['./billing-portal.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardTitle, MatCardSubtitle, MatDivider, MatCardContent, MatList, MatListItem, MatIcon, MatCardActions, MatButton]
})
export class BillingPortal {
  private readonly auth = inject(Auth);
  private readonly billingPortal = inject(BillingPortalClient);
  private readonly log = inject(Log);

  openBillingPortal(): void {
    this.billingPortal.getBillingPortal()
      .subscribe((billingPortal) => {
        if (billingPortal == null) {
          this.log.error('BillingPortalComponent.openBillingPortal: billingPortal is null');
        } else {
          window.open(billingPortal.url, '_blank');
        }
      }
      );
  }
}
