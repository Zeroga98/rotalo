import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'admin-orders',
  templateUrl: 'admin-orders.page.html',
  styleUrls: ['admin-orders.page.scss']
})
export class adminOrdersPage implements OnInit {


  constructor(private settingsService: SettingsService) {
  }

  ngOnInit(): void {
    this.loadTypeOrders();
  }

  loadTypeOrders() {
    this.settingsService.getTypeOrders().subscribe((response) => {
      console.log(response);
     });

  }
}
