import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { CurrentSessionService } from '../../../services/current-session.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../../router/routes';


@Component({
  selector: 'admin-orders',
  templateUrl: 'admin-orders.page.html',
  styleUrls: ['admin-orders.page.scss']
})
export class adminOrdersPage implements OnInit {

  public orders: Array<any> = [];
  public typeOrders: Array<any> = [];
  public noOrders;
  public selectChanged = false;
  public description: string;
  public showModalDescription: boolean;
  public referenceNumber;
  public statusOrder;

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private currentSessionSevice: CurrentSessionService) {
  }

  ngOnInit(): void {
    this.loadTypeOrders();
    const currentUser = this.currentSessionSevice.currentUser();
    if (currentUser['rol'] != 'superuser') {
      this.router.navigate([
        `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
      ]);
    }
  }

  loadTypeOrders() {
    this.settingsService.getTypeOrders().subscribe((response) => {
      this.typeOrders = response.body.estadosOrdenes;
    }, (error) => {
      console.log(error);
    });
  }

  loadOrders(idOrderStatus) {
    const params = {
      estado: idOrderStatus
    };
    this.settingsService.getOrders(params).subscribe((response) => {
      this.orders = response.body.ordenes;
      if (this.orders && this.orders.length > 0) {
        this.noOrders = false;
        this.selectChanged = true;
      } else {
        this.noOrders = true;
      }
    }, (error) => {
      console.log(error);
    });
  }

  onSelect(ev) {
    const id = ev.target.value;
    this.loadOrders(id);
  }

  changeStatusOrder() {
    const params = {
      'referencia': this.referenceNumber,
      'estado': this.statusOrder,
      'descripcion': this.description
    };
    this.settingsService.changeStatusOrders(params).subscribe((response) => {
      this.showModalDescription = false;
      alert(response.message);
      this.filterOrder(this.referenceNumber);
      this.referenceNumber = null;
      this.statusOrder = null;
      this.description = null;
    }, (error) => {
      console.log(error);
    });
  }

  filterOrder(reference) {
    this.orders = this.orders.filter(order => order.referenceNumber != reference);
  }

  openModal(referencia, estado) {
    this.referenceNumber = referencia;
    this.statusOrder = estado;
    this.showModalDescription = true;
  }

  closeModal() {
    this.showModalDescription = false;
    this.referenceNumber = null;
    this.statusOrder = null;
    this.description = null;
  }
}
