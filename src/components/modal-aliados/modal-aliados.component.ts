import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-aliados',
  templateUrl: './modal-aliados.component.html',
  styleUrls: ['./modal-aliados.component.scss']
})
export class ModalAliadosComponent implements OnInit {
  private params;
  constructor(
    private dialogRef: MatDialogRef<ModalAliadosComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      this.params = data;
    }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  goToUrl() {
    window.open(this.params, '_blank');
    this.dialogRef.close();
  }

}
