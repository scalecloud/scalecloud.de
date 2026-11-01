import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CheckoutCreateSubscriptionReply } from '../../checkout-create-subscription';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-trailing',
    templateUrl: './trailing.html',
    styleUrl: './trailing.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardHeader, MatCardTitle, MatDivider, MatCardContent, MatList, MatListItem, MatListItemIcon, MatIcon, MatCardActions, MatButton, RouterLink, DatePipe]
})
export class Trailing {

  readonly checkoutCreateSubscriptionReply = input<CheckoutCreateSubscriptionReply | undefined>(undefined);

}
