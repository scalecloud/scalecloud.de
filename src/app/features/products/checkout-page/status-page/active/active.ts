import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CheckoutCreateSubscriptionReply } from '../../checkout-create-subscription';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-active',
    templateUrl: './active.html',
    styleUrl: './active.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardTitle, MatDivider, MatCardContent, MatList, MatListItem, MatIcon, MatCardActions, MatButton, RouterLink]
})
export class Active {

  readonly checkoutCreateSubscriptionReply = input<CheckoutCreateSubscriptionReply | undefined>(undefined);

}
