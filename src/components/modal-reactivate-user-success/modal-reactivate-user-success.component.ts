import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-reactivate-user-success',
  templateUrl: './modal-reactivate-user-success.component.html',
  styleUrls: ['./modal-reactivate-user-success.component.scss']
})
export class ModalReactivateUserSuccessComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ModalReactivateUserSuccessComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
