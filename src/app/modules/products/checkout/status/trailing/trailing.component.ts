import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CheckoutCreateSubscriptionReply } from '../../checkout-create-subscription';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-trailing',
    templateUrl: './trailing.component.html',
    styleUrl: './trailing.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, MatCardTitle, MatDivider, MatCardContent, MatList, MatListItem, MatIcon, MatCardActions, MatButton, RouterLink, DatePipe]
})
export class TrailingComponent {

  @Input() checkoutCreateSubscriptionReply: CheckoutCreateSubscriptionReply | undefined;

}
