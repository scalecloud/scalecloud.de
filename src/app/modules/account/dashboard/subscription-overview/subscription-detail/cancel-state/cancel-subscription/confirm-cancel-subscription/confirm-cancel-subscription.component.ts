import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-confirm-cancel-subscription',
    templateUrl: './confirm-cancel-subscription.component.html',
    styleUrl: './confirm-cancel-subscription.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose],
})
export class ConfirmCancelSubscriptionComponent { }