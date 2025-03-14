import { Component, Input } from '@angular/core';
import { CheckoutCreateSubscriptionReply } from '../../checkout-create-subscription';

@Component({
    selector: 'app-trailing',
    templateUrl: './trailing.component.html',
    styleUrl: './trailing.component.scss',
    standalone: false
})
export class TrailingComponent {

  @Input() checkoutCreateSubscriptionReply: CheckoutCreateSubscriptionReply | undefined;

}
