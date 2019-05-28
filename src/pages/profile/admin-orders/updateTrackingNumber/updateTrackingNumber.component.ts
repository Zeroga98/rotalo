import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SettingsService } from '../../../../services/settings.service';

@Component({
  selector: 'app-updateTrackingNumber',
  templateUrl: './updateTrackingNumber.component.html',
  styleUrls: ['./updateTrackingNumber.component.scss']
})
export class UpdateTrackingNumberComponent implements OnInit, AfterViewInit {
  public trackingNumber = '';
  public shippingCompany = '';
  public shippings = [];
  public order;
  public errorMessage = false;
  constructor(
    private dialogRef: MatDialogRef<UpdateTrackingNumberComponent>,
    private settingsService : SettingsService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.order = data;
    this.loadShipping(this.order);
    this.trackingNumber = this.order.trackingNumber;
  }

  ngOnInit() {
  }


  ngAfterViewInit() {

  }


  close() {
    this.dialogRef.close();
  }

  save() {
    this.errorMessage = false;
    if (this.trackingNumber && this.shippingCompany) {
      this.order.trackingNumber = this.trackingNumber;
      const shipping = this.shippings.filter(item => {
        return item.idShippingCompany == this.shippingCompany;
      });
      if (shipping) {
        this.order.shippingCompany = shipping[0];
      }
      this.dialogRef.close(this.order);
      const params = {
        'numeroGuia': this.trackingNumber,
        'idTransportadora': this.shippingCompany
      };
      this.settingsService.updateOrden(params, this.order.idOrder).subscribe((response) => {
        alert('Orden actualizada.');
      }, (error) => {
        this.errorMessage = true;
        console.log(error);
      });
    } else  {
      this.errorMessage = true;
    }

  }

  loadShipping(order) {
    this.settingsService.getShipping().subscribe((response) => {
      if (response.body) {
        this.shippings = response.body.transportadoras;
        if (order.shippingCompany) {
          this.shippingCompany = order.shippingCompany.idShippingCompany;
        }
      }
    }, (error) => {
      console.log(error);
    });
  }

}
