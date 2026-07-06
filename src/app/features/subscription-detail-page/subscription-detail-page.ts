import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SubscriptionDetailCard } from './subscription-detail-card/subscription-detail-card';
import { Seats } from './seats/seats';
import { PaymentMethodOverviewComponent } from '../dashboard-page/payment-method-overview/payment-method-overview.component';
import { Invoices } from './invoices/invoices';
import { BillingAddressOverview } from './billing-address-client/billing-address-overview/billing-address-overview';
import { BillingPortal } from './customer-portal/billing-portal';

@Component({
    selector: 'app-subscription-detail-page',
    templateUrl: './subscription-detail-page.html',
    styleUrls: ['./subscription-detail-page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SubscriptionDetailCard, Seats, PaymentMethodOverviewComponent, Invoices, BillingAddressOverview, BillingPortal]
})
export class SubscriptionDetailPage {

}
