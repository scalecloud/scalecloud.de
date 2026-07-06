import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-confirm-cancel-subscription',
    templateUrl: './confirm-cancel-subscription.html',
    styleUrl: './confirm-cancel-subscription.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose],
})
export class ConfirmCancelSubscription { }