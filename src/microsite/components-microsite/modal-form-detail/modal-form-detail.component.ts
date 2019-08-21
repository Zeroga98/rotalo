import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { TypeDocumentsService } from '../../../services/type-documents.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ConfigurationService } from '../../../services/configuration.service';



function validateNameUser(
  name: AbstractControl
): { [key: string]: boolean } | null {
  const nameValue = name.value;
  const arrayName = nameValue.split(' ').filter(function (v) { return v !== ''; });
  if (arrayName.length == 1) {
    return { nameError: true };
  }
  return null;
}


@Component({
  selector: 'app-modal-form-detail',
  templateUrl: './modal-form-detail.component.html',
  styleUrls: ['./modal-form-detail.component.scss']
})
export class ModalFormDetailComponent implements OnInit  {

  public idProduct: number = parseInt(this.router.url.split('?', 2)[0].replace(/[^\d]/g, ''));
    public currentUrl;
    constructor(
      private router: Router,
      private userService: UserService,
      private dialogRef: MatDialogRef<ModalFormDetailComponent>,
      @Inject(MAT_DIALOG_DATA) data) {
        this.currentUrl = window.location.href;
      }

    ngOnInit() {
    }

    close() {
      this.dialogRef.close();
    }

 }
