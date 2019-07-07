import { Component, OnInit, Inject, AfterViewInit, Input, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-modal-reactivate-user',
  templateUrl: './modal-reactivate-user.component.html',
  styleUrls: ['./modal-reactivate-user.component.scss']
})
export class ModalReactivateUserComponent implements OnInit, AfterViewInit {
  public email;

  constructor(private settingsService: SettingsService,
    private eleRef: ElementRef,
    private dialogRef: MatDialogRef<ModalReactivateUserComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    console.log(MAT_DIALOG_DATA);
    console.log(data);
    this.email = data;
    console.log(this.email);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
