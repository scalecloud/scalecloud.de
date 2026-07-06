import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { SubscriptionOverviewModel } from './subscription-overview-model';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatChip } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-subscription-overview',
  templateUrl: './subscription-overview.html',
  styleUrl: './subscription-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions,
    MatDivider, MatList, MatListItem,
    MatTooltip, MatIcon, MatButton, MatChip,
    RouterLink,
  ],
})
export class SubscriptionOverview {
  // Input property expected by the tests and consumers
  readonly subscriptionOverview = input<SubscriptionOverviewModel | undefined>(undefined);

  // Keep a `subscriptionOverviewModel` computed signal for backwards compatibility
  readonly subscriptionOverviewModel = computed(() => this.subscriptionOverview());

  /** Storage per user × number of users, in TB. */
  readonly totalStorageAmount = computed(() => {
    const storage = this.subscriptionOverviewModel()?.storageAmount ?? 0;
    const users   = this.subscriptionOverviewModel()?.userCount   ?? 0;
    return storage * users;
  });
}