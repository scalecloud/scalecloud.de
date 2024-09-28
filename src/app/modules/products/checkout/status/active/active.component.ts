import { Component, Input } from '@angular/core';
import { CheckoutCreateSubscriptionReply } from '../../checkout-create-subscription';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrl: './active.component.scss'
})
export class ActiveComponent {

  @Input() checkoutCreateSubscriptionReply: CheckoutCreateSubscriptionReply | undefined;

}
