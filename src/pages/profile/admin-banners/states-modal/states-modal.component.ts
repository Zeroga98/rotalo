import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'states-modal',
  templateUrl: './states-modal.component.html',
  styleUrls: ['./states-modal.component.scss']
})
export class StatesModalComponent implements OnInit , AfterViewInit {
  public  params;

  constructor(private dialogRef: MatDialogRef<StatesModalComponent>,
  @Inject(MAT_DIALOG_DATA) data) {
    this.params = data;

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


  selectAll (element: HTMLInputElement) {
    const container = document.getElementById('check-container');
    const inputs = container.getElementsByTagName('input');
    if (element.id == '-1') {
      if (element.checked) {
        for (let i = 0; i < inputs.length; ++i) {
          inputs[i].checked = true;
        }
      } else  {
        for (let i = 0; i < inputs.length; ++i) {
          inputs[i].checked = false;
        }
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

}
