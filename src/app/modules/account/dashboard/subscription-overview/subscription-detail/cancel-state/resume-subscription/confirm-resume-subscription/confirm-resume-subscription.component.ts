import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-confirm-resume-subscription',
    templateUrl: './confirm-resume-subscription.component.html',
    styleUrls: ['./confirm-resume-subscription.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class ConfirmResumeSubscriptionComponent {

}
