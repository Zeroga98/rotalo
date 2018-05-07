import { OfferService } from "./../../services/offer.service";
import { Router } from "@angular/router";
import { NotificationsInterface } from "./../../commons/interfaces/notifications.interface";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { NotificationsService } from "../../services/notifications.service";
import { ConversationInterface } from "../../commons/interfaces/conversation.interface";
import { ROUTES } from "../../router/routes";
import { BuyService } from "../../services/buy.service";

@Component({
  selector: "notifications-page",
  templateUrl: "notifications.page.html",
  styleUrls: ["notifications.page.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsPage implements OnInit {
  public notificationsList: Array<NotificationsInterface> = [];
  public conversation: ConversationInterface;
  public idProduct: string;
  public configModalRate = {};
  public paymentTypes = {
    cash: "Efectivo",
    bank_account_transfer: "Transferencia bancaria",
    qr_code_transfer: "Código QR",
    sufi_credit: "Crédito SUFI",
    na: "No aplica"
  };
  readonly defaultImage: string = "../assets/img/product-no-image.png";
  public idProductMessage: string;
  public idUserProductMessage: string;
  private _isModalRateShow: boolean = false;
  showMessage: boolean = false;
  idConversation;
  public showSpinner = true;
  constructor(
    private notificationsService: NotificationsService,
    private changeDetectorRef: ChangeDetectorRef,
    private offerService: OfferService,
    private buyService: BuyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  productIsFree(notification: NotificationsInterface) {
    return notification.product["sell-type"] === "GRATIS";
  }

  async acceptPurchase(notification: NotificationsInterface) {
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
      const response = await this.buyService.confirmPurchase(notification.purchase.id);
      if (this.productIsFree(notification)) {
        notification.status = 'Lo has regalado';
      } else {
        notification.status = 'Compra confirmada';
      }
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  async declinePurchase(notification: NotificationsInterface) {
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
      const response = await this.buyService.declinePurchase(notification.purchase.id);
      if (this.productIsFree(notification)) {
        notification.status = 'No lo has regalado';
      } else {
        notification.status = 'Compra rechazada';
      }
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  async regretOffer(notification:NotificationsInterface){
    try {
      if (!confirm("¿Estás seguro que deseas cancelar la compra?")) return;
      const response = await this.offerService.regretOffer(notification.offer.id as number);
      notification.status = "Compra cancelada";
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  async acceptOffer(notification: NotificationsInterface) {
    try {
      if (!confirm("¿Estás seguro que deseas aceptar la oferta?")) return;
      const response = await this.offerService.acceptOffer(notification.offer
        .id as number);
      notification.status = "Oferta aceptada";
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  async declineOffer(notification: NotificationsInterface) {
    try {
      if (!confirm("¿Estás seguro que deseas rechazar la oferta?")) return;
      const response = await this.offerService.declineOffer(notification.offer
        .id as number);
      notification.status = "Oferta rechazada";
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  buyProduct(notification: NotificationsInterface){
    const id = notification.product.id;
    this.router.navigate([`${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.BUY}/${id}`]);
  }

  openConversation(notification: NotificationsInterface) {
    if (notification.message) {
      this.idConversation = `${notification.product.id}-${notification.message["author-id"]}`;
    } else {
      this.idConversation = undefined;
      this.conversation = this._getDefaultConversation(notification);
    }
    this.idProduct = `${notification.product.id}`;
    this.showMessage = true;
  }

  closeModalRate() {
    this._isModalRateShow = false;
    this.loadNotifications();
  }

  closeModalSendMessage() {
    this.showMessage = false;
  }

  showModalRate(notification) {
    this.configModalRate = this.buildRateObject(notification);
    this._isModalRateShow = true;
  }

  goToDetail(notification) {
    const id = notification.product.id;
    this.router.navigate([
      `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${id}`
    ]);
  }

  get isModalRateShow() {
    return this._isModalRateShow;
  }

  private buildRateObject(notification){
    let rate, comment;
    const options = ["seller-rate", "buyer-rate"];
    if(notification.purchase){
      options.forEach( option => {
        if(notification.purchase[option]){
          rate = notification.purchase[option].value;
          comment = notification.purchase[option].comment;
        }
      });
    }

    return {
      type: notification['notification-type'],
      productId: notification.product.id,
      name: notification.product.user.name,
      purchase: notification.purchase,
      "purchase-id": notification.purchase.id,
      "seller-rate": rate,
      comment
    }
  }

  private async loadNotifications(){
    try {
      this.notificationsList = await this.notificationsService.getNotifications();
      console.log(this.notificationsList);
      this.showSpinner = false;
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  private _getDefaultConversation(notification: NotificationsInterface) {
    const name = notification.purchase
      ? notification.purchase.user.name
      : notification.offer.user.name;
    const photo = this.defaultImage;
    return { name, photo };
  }
}
