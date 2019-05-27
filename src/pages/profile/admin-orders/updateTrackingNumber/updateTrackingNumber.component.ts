import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SettingsService } from '../../../../services/settings.service';

@Component({
  selector: 'app-updateTrackingNumber',
  templateUrl: './updateTrackingNumber.component.html',
  styleUrls: ['./updateTrackingNumber.component.scss']
})
export class UpdateTrackingNumberComponent implements OnInit {
  public trackingNumber;
  public shippings = [];
  constructor(
    private dialogRef: MatDialogRef<UpdateTrackingNumberComponent>,
    private settingsService : SettingsService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.trackingNumber = data;
  }

  ngOnInit() {
    this.loadShipping();
  }

  close() {
    this.dialogRef.close();
  }

  loadShipping() {
    this.settingsService.getShipping().subscribe((response) => {
      if (response.body) {
        this.shippings = response.body.transportadoras;
      }
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  }

}
