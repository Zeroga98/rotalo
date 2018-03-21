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

  async ngOnInit() {
    try {
      this.notificationsList = await this.notificationsService.getNotifications();
      console.log(this.notificationsList);
      this.showSpinner = false;
      this.changeDetectorRef.markForCheck();
    } catch (error) {}
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
  }

  closeModalSendMessage() {
    this.showMessage = false;
  }

  showModalRate(notification) {
    this.configModalRate = {
      name: notification.product.user.name,
      "purchase-id": notification.purchase.id,
      "seller-rate":
        notification.status && notification.purchase
          ? notification.purchase["seller-rate"].value
          : false,
      comment:
        notification.status && notification.purchase
          ? notification.purchase["seller-rate"].comment
          : undefined
    };
    this._isModalRateShow = true;
  }

  goToDetail(id: number) {
    this.router.navigate([
      `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${id}`,
      { readOnly: true }
    ]);
  }

  get isModalRateShow() {
    return this._isModalRateShow;
  }

  private _getDefaultConversation(notification: NotificationsInterface) {
    const name = notification.purchase
      ? notification.purchase.user.name
      : notification.offer.user.name;
    const photo = this.defaultImage;
    return { name, photo };
  }
}
