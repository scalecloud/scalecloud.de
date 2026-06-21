import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CheckoutCreateSubscriptionReply } from '../../checkout-create-subscription';

@Component({
    selector: 'app-trailing',
    templateUrl: './trailing.component.html',
    styleUrl: './trailing.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TrailingComponent {

  @Input() checkoutCreateSubscriptionReply: CheckoutCreateSubscriptionReply | undefined;

}
