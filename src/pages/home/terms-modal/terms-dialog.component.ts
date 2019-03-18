import { Component, OnInit, Inject, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'terms-dialog',
  templateUrl: './terms-dialog.component.html',
  styleUrls: ['./terms-dialog.component.scss']
})
export class TermsDialogComponent implements OnInit , AfterViewInit {
  public email;

  constructor(private settingsService: SettingsService,
    private eleRef:ElementRef,
    private dialogRef: MatDialogRef<TermsDialogComponent>,
  @Inject(MAT_DIALOG_DATA) data) {
    this.email = data;

   }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  save() {
    const params =  {
      'correo': this.email,
      'idTerminoCondicion': this.settingsService.getIdterms()
    }
    this.settingsService.acceptTerms(params).subscribe((response) => {
      this.dialogRef.close();
    } ,
    (error) => {
      this.dialogRef.close();
      console.log(error);
    });
  }


  close() {
    this.dialogRef.close();
  }

}
