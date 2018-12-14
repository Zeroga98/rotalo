import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'admin-orders',
  templateUrl: 'admin-orders.page.html',
  styleUrls: ['admin-orders.page.scss']
})
export class adminOrdersPage implements OnInit {

  public orders: Array<any> = [];
  public typeOrders: Array<any> = [];
  public noOrders;
  constructor(private settingsService: SettingsService) {
  }

  ngOnInit(): void {
    this.loadTypeOrders();
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
      } else  {
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


}
