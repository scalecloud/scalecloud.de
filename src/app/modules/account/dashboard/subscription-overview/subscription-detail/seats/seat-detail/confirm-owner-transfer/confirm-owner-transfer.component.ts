import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
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
  dialogRef = inject<MatDialogRef<ConfirmOwnerTransferComponent>>(MatDialogRef);
  data = inject<{
    email: string;
}>(MAT_DIALOG_DATA);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  
}
