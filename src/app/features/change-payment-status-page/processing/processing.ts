import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { ReturnUrl } from 'src/app/core/redirect/return-url';

@Component({
    selector: 'app-processing',
    templateUrl: './processing.html',
    styleUrls: ['./processing.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardHeader, MatCardTitle, MatDivider, MatCardContent, MatList, MatListItem, MatListItemIcon, MatIcon, MatCardActions, MatButton]
})
export class Processing {
  private readonly returnUrl = inject(ReturnUrl);

  openReturnUrl(): void {
    this.returnUrl.openReturnURL("/dashboard");
  }

}
