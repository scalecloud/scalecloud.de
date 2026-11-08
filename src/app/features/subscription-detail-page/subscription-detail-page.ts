import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SubscriptionDetailCard } from './subscription-detail-card/subscription-detail-card';
import { Seats } from './seats/seats';
import { PaymentMethodOverview } from '../dashboard-page/payment-method-overview/payment-method-overview';
import { Invoices } from './invoices/invoices';
import { BillingAddressOverview } from './billing-address-client/billing-address-overview/billing-address-overview';
import { BillingPortal } from './customer-portal/billing-portal';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';

@Component({
    selector: 'app-subscription-detail-page',
    templateUrl: './subscription-detail-page.html',
    styleUrls: ['./subscription-detail-page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatTabGroup, MatTab, MatTabContent, SubscriptionDetailCard, Seats, PaymentMethodOverview, Invoices, BillingAddressOverview, BillingPortal]
})
export class SubscriptionDetailPage {

}
