import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-owner-transfer',
    templateUrl: './confirm-owner-transfer.component.html',
    styleUrl: './confirm-owner-transfer.component.scss',
    standalone: false
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
