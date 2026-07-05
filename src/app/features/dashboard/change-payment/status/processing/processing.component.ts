import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { ReturnUrl } from 'src/app/core/redirect/return-url';

@Component({
    selector: 'app-processing',
    templateUrl: './processing.component.html',
    styleUrls: ['./processing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardTitle, MatDivider, MatCardContent, MatList, MatListItem, MatIcon, MatCardActions, MatButton]
})
export class ProcessingComponent {
  private readonly returnUrl = inject(ReturnUrl);

  openReturnUrl(): void {
    this.returnUrl.openReturnURL("/dashboard");
  }

}
