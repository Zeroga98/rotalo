import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'modal-form-register',
  templateUrl: './modal-form-register.component.html',
  styleUrls: ['./modal-form-register.component.scss']
})
export class ModalFormRegisterComponent implements OnInit {
public typeDocumentsFilter = [];
  constructor(
    private dialogRef: MatDialogRef<ModalFormRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
