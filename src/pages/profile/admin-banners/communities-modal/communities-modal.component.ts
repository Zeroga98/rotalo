import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'communities-modal',
  templateUrl: './communities-modal.component.html',
  styleUrls: ['./communities-modal.component.scss']
})
export class CommunitiesModalComponent implements OnInit , AfterViewInit {
  public  params;

  constructor(private dialogRef: MatDialogRef<CommunitiesModalComponent>,
  @Inject(MAT_DIALOG_DATA) data) {
    this.params = data;
    console.log(this.params);
   }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  save() {
    this.params = this.getCheckCommpanies();
    this.dialogRef.close(this.params);
  }

  getCheckCommpanies() {
    const container = document.getElementById('check-container');
    const inputs = container.getElementsByTagName('input');
    const checkId = [];
    for (let i = 0; i < inputs.length; ++i) {
      if (inputs[i].checked) {
        const id = parseInt(inputs[i].id);
        checkId.push(id);
      }
    }
    if (checkId.length == 0) {
      checkId.push(-1);
    }
    return checkId;
  }

  close() {
    this.dialogRef.close();
  }

}
