import { Component, OnInit, Inject, AfterViewInit, Input, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
    this.email = data;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
