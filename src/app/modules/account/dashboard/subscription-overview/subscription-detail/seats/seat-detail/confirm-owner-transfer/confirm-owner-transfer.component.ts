import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-confirm-owner-transfer',
    templateUrl: './confirm-owner-transfer.component.html',
    styleUrl: './confirm-owner-transfer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class ConfirmOwnerTransferComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmOwnerTransferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  
}
