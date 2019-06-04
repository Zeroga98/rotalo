import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input
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
    transfer_bancolombia: 'Transferencia bancaria',
    qr_code_transfer: 'Código QR',
    sufi_credit: 'Crédito SUFI',
    na: 'No aplica'
  };
  private currentPage: number = 1;
  private filterNotification = {
    size: 5,
    number: this.currentPage
  };
  @Input() isNotificationMobile: boolean ;
  public showSpinner = false;
  public totalNotificationes;
  public isInfiniteScrollDisabled: boolean = false;

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
    if(this.isNotificationMobile) {
      this.loadNotifications();
    } else  {
      this.startLoadNotifications();
    }

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
    this.showSpinner = true;
    this.notificationService.getNotifications(this.filterNotification).subscribe(
      notification => {
        const idNotifications = [];
        notification.body.notificaciones.map(message => {
          idNotifications.push(message.idNotificacion);
        });

        this.messages = this.messages.concat(notification.body.notificaciones);
        this.updateNotification(idNotifications);
        this.showSpinner = false;
        this.totalNotificationes =  notification.body.totalNotificaciones;
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

  /*async acceptOffer(notification) {
    try {
      if (!confirm('¿Estás seguro que deseas aceptar la oferta?')) return;
      const response = await this.offerService.acceptOffer(
        notification.oferta.idOferta.toString()
      );
      notification.status = 'Oferta aceptada';
    } catch (error) {
      console.error(error);
    }
  }*/

  /*async declineOffer(notification) {
    try {
      if (!confirm('¿Estás seguro que deseas rechazar la oferta?')) return;
      const response = await this.offerService.declineOffer(
        notification.oferta.idOferta.toString()
      );
      notification.status = 'Oferta rechazada';
    } catch (error) {
      console.error(error);
    }
  }*/

  goToDetail(notification) {
    if ( notification.producto && notification.producto.idProducto) {
      const id = notification.producto.idProducto;
      window.location.href = `${window.location.origin}/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${id}`;
    }
  }

  goToOrderDetail(reference) {
      window.location.href = `${window.location.origin}/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.DETAILORDERS}/${reference}`;
  }

  buyProduct(notification) {
    const id = notification.producto.idProducto;
    if ( notification.producto && notification.producto.idProducto) {
      window.location.href = `${window.location.origin}/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.BUY}/${id}`;
    }
   /* this.router.navigate([
      `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.BUY}/${id}`
    ]);*/
  }

  /*async regretOffer(notification) {
    try {
      if (!confirm('¿Estás seguro que deseas cancelar la compra?')) return;
      const response = await this.offerService.regretOffer(
        notification.oferta.idOferta.toString()
      );
      notification.status = 'Compra cancelada';
    } catch (error) {
      console.error(error);
    }
  }*/

  productIsFree(notification) {
    return notification.producto.tipoVenta === 'GRATIS';
  }

  /*async acceptPurchase(notification) {
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
        notification.status = 'Compra registrada';
      }
    } catch (error) {
      console.error(error);
    }
  }*/

  /*async declinePurchase(notification) {
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
  }*/

  returnTotalPurchase(notification) {
    let amountPurchase = 0;
    if (notification.informacionAdicional) {
      const obj = JSON.parse(notification.informacionAdicional);
      amountPurchase = obj.total_order;
    }
    return amountPurchase;
  }

  getAdditionalInfo(notification){
    let aditionalInformation;
    if(notification.informacionAdicional){
      const obj = JSON.parse(notification.informacionAdicional);
      aditionalInformation = obj;
    }
    return aditionalInformation;
  }

  updateSellUnknow(notification) {
    const param = {
      idNotificacion: notification.idNotificacion,
      estado: notification.type
    };
    this.notificationService.updateSellUnknow(param).subscribe(
      state => {
        let gaPushParam = 'ClicLoVendiRotalo';
        if (notification.type === 'out'){
          gaPushParam = 'ClicLoVendiFueraRotalo';
          notification.accionExpirado = 'sell_unknow_out';
        } else if(notification.type === 'in'){
          gaPushParam = 'ClicLoVendiRotalo';
          notification.accionExpirado = 'sell_unknow_in';
        } else {
          gaPushParam = 'ClicNoLoQuieroPublicarMas';
          notification.accionExpirado = 'do_not_republish';
        }
        this.gapush(
          'send',
          'event',
          'Notificaciones',
          gaPushParam,
          'EnviarExitoso'
        );
        this.changeDetector.markForCheck();
      },
      error => console.log(error)
    );
  }

  gapush(method, type, category, action, label) {
    const paramsGa = {
      event: 'pushEventGA',
      method: method,
      type: type,
      categoria: category,
      accion: action,
      etiqueta: label
    };
    window['dataLayer'].push(paramsGa);
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


  nextStep (notification) {
    notification.step = true;
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

  scrolledInfinite(){
    this.loadMoreNotification();
  }

  getUrlImge(notification) {
    if(notification && notification.fotoNotificacion)
    {
      return ('url(' + notification.fotoNotificacion.replace(/ /g, '%20')) + ')';
    }
  }

}
