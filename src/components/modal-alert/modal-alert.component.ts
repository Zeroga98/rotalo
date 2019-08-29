import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss']
})
export class ModalAlertComponent implements OnInit {

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<ModalAlertComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
