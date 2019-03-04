import { ROUTES } from './../../../router/routes';
import { Router } from '@angular/router';
import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { MessagesService } from '../../../services/messages.service';

@Component({
  selector: 'purchase-accepted',
  templateUrl: './purchase-accepted.component.html',
  styleUrls: ['./purchase-accepted.component.scss']
})
export class PurchaseAcceptedComponent implements OnInit {
  @Input() notification;
  @Output() userClicked: EventEmitter<any> = new EventEmitter();
  @Output() onContactSeller: EventEmitter<any> = new EventEmitter();
  @Output() notificationDelete: EventEmitter<any> = new EventEmitter();
  public amountPurchase = 0;
  constructor(private productsService: ProductsService, private router: Router,
    private notificationService: MessagesService) {
  }

  ngOnInit() {
    if (this.notification.informacionAdicional) {
      const obj = JSON.parse(this.notification.informacionAdicional);
      this.amountPurchase = obj.total_order;
    }
  }

  async productReceived(id: number) {
    try {
      const response = await this.productsService.receiveProduct(id);
      this.notification.status = 'Has recibido el producto';
    } catch (error) {
      console.error(error);
      console.error('Ha ocurrido un error');
    }
  }


  clickUser() {
    this.userClicked.emit();
  }

  goToDetail(id: number) {
    this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${id}`]);
  }

  contactSeller(id: number) {
    this.onContactSeller.emit(id);
  }

  public deleteNotification(idNotifications) {
    const params = {
      'idNotificacion': idNotifications
    };
    const result = confirm('¿Seguro quieres borrar esta notificación?');
    if (!result) {
      return;
    }
    this.notificationService.deleteNotification(params).subscribe(
      notification => {
        this.notificationDelete.emit(idNotifications);
      },
      error => console.log(error)
    );
  }



}
