import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { ISubscriptionOverview } from './subscription-overview';
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
  templateUrl: './subscription-overview.component.html',
  styleUrl: './subscription-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions,
    MatDivider, MatList, MatListItem,
    MatTooltip, MatIcon, MatButton, MatChip,
    RouterLink,
  ],
})
export class SubscriptionOverviewComponent {
  readonly subscriptionOverview = input<ISubscriptionOverview | undefined>(undefined);

  /** Storage per user × number of users, in TB. */
  readonly totalStorageAmount = computed(() => {
    const storage = this.subscriptionOverview()?.storageAmount ?? 0;
    const users   = this.subscriptionOverview()?.userCount   ?? 0;
    return storage * users;
  });
}