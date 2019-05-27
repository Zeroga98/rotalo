import { Component, OnInit } from '@angular/core';
import { ROUTES } from '../../../router/routes';
import { Router } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { CurrentSessionService } from '../../../services/current-session.service';
import * as moment from 'moment';
import { UtilsService } from '../../../util/utils.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { UpdateTrackingNumberComponent } from './updateTrackingNumber/updateTrackingNumber.component';

@Component({
  selector: 'admin-orders',
  templateUrl: 'admin-orders.page.html',
  styleUrls: ['admin-orders.page.scss']
})
export class adminOrdersPage implements OnInit {
  public orders = [];
  public typeOrders: Array<any> = [];
  edit: string = `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.UPLOAD}/`;
  show: string = `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/`;
  public messageChange = '';
  public errorChange = '';
  public currentFilter: Object = {
  };

  public name = '';
  public email = '';
  public since = '';
  public until = '';
  public typeOrder = '';

  constructor(
    private router: Router,
    private utilService: UtilsService,
    private settingsService: SettingsService,
    private currentSessionSevice: CurrentSessionService,
    public dialog: MatDialog
   ) {
  }

  ngOnInit(): void {
    this.getOrderList(this.currentFilter);
    this.loadTypeOrders();
  }


   getOrderList(params: Object = {}) {
    this.settingsService.getOrders(params).subscribe((response) => {
      if (response.body) {
        this.orders = response.body.ordenes;
      }
    },
    (error) => {
      console.log(error);
    });
  }

  loadTypeOrders() {
    this.settingsService.getTypeOrders().subscribe((response) => {
      this.typeOrders = response.body.estadosOrdenes;
    }, (error) => {
      console.log(error);
    });
  }

  getFormatDate(date) {
    if (date) {
      const dateMoment: any = moment(date);
      return dateMoment.format('DD/MM/YYYY');
    }
    return '';
  }

  setFilter() {
    this.email = this.email.replace(/\s/g, '');
    const email = this.email.replace('+', '$');
    this.since = this.since.replace(/\s/g, '');
    this.until = this.until.replace(/\s/g, '');
    const filter = {
       buyer_name: this.name ? `/${this.name}/`  : '' ,
       buyer_email: this.email ? `/${email}/`  : '' ,
       created_at_from: this.since ? this.since : '',
       created_at_until: this.until ? this.until : '',
       id_order_status: this.typeOrder ? this.typeOrder : ''
     };
     this.currentFilter = Object.assign({}, this.currentFilter, filter);
     this.currentFilter = this.utilService.removeEmptyValues(this.currentFilter);
     this.getOrderList(this.currentFilter)
   }

   setInitialValues() {
    this.name = '';
    this.typeOrder = '';
    this.since = '';
    this.until = '';
    this.email = '';
  }

  removeFilter() {
    this.setInitialValues();
    this.currentFilter = {};
    this.getOrderList(this.currentFilter);
  }

  onSelect(ev) {
    const id = ev.target.value;
    this.typeOrder = id;
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(UpdateTrackingNumberComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
