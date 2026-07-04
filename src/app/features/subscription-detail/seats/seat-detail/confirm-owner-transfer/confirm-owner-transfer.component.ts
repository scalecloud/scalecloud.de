import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

export interface ConfirmOwnerTransferData {
  email: string;
}

@Component({
  selector: 'app-confirm-owner-transfer',
  templateUrl: './confirm-owner-transfer.component.html',
  styleUrl: './confirm-owner-transfer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose],
})
export class ConfirmOwnerTransferComponent {
  readonly dialogRef = inject<MatDialogRef<ConfirmOwnerTransferComponent>>(MatDialogRef);
  readonly data = inject<ConfirmOwnerTransferData>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}