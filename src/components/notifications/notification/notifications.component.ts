import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CurrentSessionService } from '../../../services/current-session.service';
import { MessagesService } from '../../../services/messages.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../../router/routes';
import { OfferService } from '../../../services/offer.service';
import { BuyService } from '../../../services/buy.service';
import { ProductsService } from '../../../services/products.service';
import { NavigationTopService } from '../../../components/navigation-top/navigation-top.service';


@Component({
  selector: 'notifications-component',
  templateUrl: 'notifications.component.html',
  styleUrls: ['notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  public userId: any;
  public messages = [];
  public paymentTypes = {
    cash: 'Efectivo',
    bank_account_transfer: 'Transferencia bancaria',
    qr_code_transfer: 'Código QR',
    sufi_credit: 'Crédito SUFI',
    na: 'No aplica'
  };
  private currentPage: number = 1;
  private filterNotification = {
    size: 5,
    number: this.currentPage
  };

  constructor(
    private notificationService: MessagesService,
    private router: Router,
    private offerService: OfferService,
    private buyService: BuyService,
    private currentSessionService: CurrentSessionService,
    private productsService: ProductsService,
    private changeDetector: ChangeDetectorRef,
    private navigationTopService:NavigationTopService) {}

  ngOnInit() {
    this.userId = this.currentSessionService.getIdUser();
    this.startLoadNotifications();
  //  this.loadNotifications();
  }

  startLoadNotifications() {
    this.navigationTopService.currentLoadNotification.subscribe(event => {
      if (event) {
        this.currentPage = 1;
        this.filterNotification.number = this.currentPage;
        this.messages = [];
        this.loadNotifications();
      }
     });
  }

  private  loadNotifications() {
    this.notificationService.getNotifications(this.filterNotification).subscribe(
      notification => {
        const idNotifications = [];
        notification.body.notificaciones.map(message => {
          idNotifications.push(message.idNotificacion);
        });

        this.messages = this.messages.concat(notification.body.notificaciones);
        this.updateNotification(idNotifications);
        this.changeDetector.markForCheck();
      },
      error => console.log(error)
    );
  }

  private updateNotification(idNotifications) {
    const params = {
      'idsNotificacion': idNotifications
    };
    this.notificationService.updateNotification(params).subscribe(
      notification => {
      },
      error => console.log(error)
    );
  }


  private deleteFromArrayNotification(idNotification) {
    this.messages = this.messages.filter(message => {
      return message.idNotificacion != idNotification;
    });
  }

  public deleteNotification(idNotifications) {
    const params = {
      'idNotificacion': idNotifications
    };
    const result = confirm('¿Seguro quieres borrar esta notificación?');
    if (!result) {
      return;
    }
    this.deleteFromArrayNotification(idNotifications);
    this.notificationService.deleteNotification(params).subscribe(
      notification => {
      },
      error => console.log(error)
    );
  }

  async acceptOffer(notification) {
    try {
      if (!confirm('¿Estás seguro que deseas aceptar la oferta?')) return;
      const response = await this.offerService.acceptOffer(
        notification.oferta.idOferta.toString()
      );
      notification.status = 'Oferta aceptada';
    } catch (error) {
      console.error(error);
    }
  }

  async declineOffer(notification) {
    try {
      if (!confirm('¿Estás seguro que deseas rechazar la oferta?')) return;
      const response = await this.offerService.declineOffer(
        notification.oferta.idOferta.toString()
      );
      notification.status = 'Oferta rechazada';
    } catch (error) {
      console.error(error);
    }
  }

  goToDetail(notification) {
    const id = notification.producto.idProducto;
    this.router.navigate([
      `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${id}`
    ]);
  }

  buyProduct(mensaje) {
    const id = mensaje.producto.idProducto;
    this.router.navigate([
      `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.BUY}/${id}`
    ]);
  }

  async regretOffer(notification) {
    try {
      if (!confirm('¿Estás seguro que deseas cancelar la compra?')) return;
      const response = await this.offerService.regretOffer(
        notification.oferta.idOferta.toString()
      );
      notification.status = 'Compra cancelada';
    } catch (error) {
      console.error(error);
    }
  }

  productIsFree(notification) {
    return notification.producto.tipoVenta === 'GRATIS';
  }

  async acceptPurchase(notification) {
    let confirmMessage;
    if (this.productIsFree(notification)) {
      confirmMessage = '¿Estás seguro que deseas regalar tu producto?';
    } else {
      confirmMessage = '¿Estás seguro que deseas confirmar la compra?';
    }
    try {
      if (!confirm(confirmMessage)) {
        return;
      }
      const response = await this.buyService.confirmPurchase(
        notification.compra.idCompra.toString()
      );
      if (this.productIsFree(notification)) {
        notification.status = 'Lo has regalado';
      } else {
        notification.status = 'Compra confirmada';
      }
    } catch (error) {
      console.error(error);
    }
  }

  async declinePurchase(notification) {
    let confirmMessage;
    if (this.productIsFree(notification)) {
      confirmMessage = '¿Estás seguro que no deseas regalar el producto?';
    } else {
      confirmMessage = '¿Estás seguro que deseas cancelar la compra?';
    }
    try {
      if (!confirm(confirmMessage)) {
        return;
      }
      const response = await this.buyService.declinePurchase(
        notification.compra.idCompra.toString()
      );
      if (this.productIsFree(notification)) {
        notification.status = 'No lo has regalado';
      } else {
        notification.status = 'Compra rechazada';
      }
    } catch (error) {
      console.error(error);
    }
  }

  returnTotalPurchase(notification) {
    let amountPurchase = 0;
    if (notification.informacionAdicional) {
      const obj = JSON.parse(notification.informacionAdicional);
      amountPurchase = obj.total_order;
    }
    return amountPurchase;
  }

  updateSellUnknow(notification, type:String) {
    const param = {
      idNotificacion: notification.idNotificacion,
      estado: type
    };
    this.notificationService.updateSellUnknow(param).subscribe(
      state => {
        if (type === 'out'){
          notification.accionExpirado = 'sell_unknow_out';
        } else {
          notification.accionExpirado = 'sell_unknow_in';
        }
      },
      error => console.log(error)
    );
  }

  republish(notification) {
    const id = notification.producto.idProducto;
    const param = {
      idNotificacion: notification.idNotificacion,
      idProducto: id
    };
    const result =
    confirm('Al republicar verifica que las imágenes muestren bien los atributos y beneficios de tu producto. Además, revisa que el precio sea adecuado y considera “Recibir ofertas” de los compradores.');
    if (!result) {
      return;
    }
    this.productsService.republishService(param).subscribe(
      state => {
        notification.accionExpirado = 'republished';
        this.router.navigate([
          `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.UPLOAD}/${id}`
        ]);
      },
      error => console.log(error)
    );
  }

  goToHobbies() {
    this.router.navigate([`/${ROUTES.PROFILE}/${ROUTES.HOBBIES}`]);
  }

  loadMoreNotification() {
    if(this.messages.length == 0) {
      this.currentPage = 1;
    } else {
      this.currentPage++;
    }
    this.filterNotification.number = this.currentPage;
    this.loadNotifications();
  }


}
