import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SubscriptionDetailCardComponent } from './subscription-detail-card/subscription-detail-card.component';
import { SeatsComponent } from './seats/seats.component';
import { PaymentOverviewComponent } from '../../payment-overview/payment-overview.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { BillingAddressOverviewComponent } from './billing-address/billing-address-overview/billing-address-overview.component';
import { BillingPortalComponent } from './customer-portal/billing-portal.component';

@Component({
    selector: 'app-subscription-detail',
    templateUrl: './subscription-detail.component.html',
    styleUrls: ['./subscription-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SubscriptionDetailCardComponent, SeatsComponent, PaymentOverviewComponent, InvoicesComponent, BillingAddressOverviewComponent, BillingPortalComponent]
})
export class SubscriptionDetailComponent {

}
