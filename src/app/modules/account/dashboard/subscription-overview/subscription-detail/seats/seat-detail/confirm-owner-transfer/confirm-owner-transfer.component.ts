import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-owner-transfer',
  templateUrl: './confirm-owner-transfer.component.html',
  styleUrl: './confirm-owner-transfer.component.scss'
})
export class ConfirmOwnerTransferComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmOwnerTransferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  
}
