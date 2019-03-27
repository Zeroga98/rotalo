import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from '../../services/messages.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { ShareInfoChatService } from '../chat-thread/shareInfoChat.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { OfferService } from '../../services/offer.service';
import { BuyService } from '../../services/buy.service';
import { ROUTES } from '../../router/routes';
import { ProductsService } from '../../services/products.service';
import { ProductInterface } from '../../commons/interfaces/product.interface';

@Component({
  selector: 'chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  readonly defaultImage: string = '../assets/img/user_sin_foto.svg';
  private idUserConversation;
  private userId;
  private readonly timeToCheckNotification: number = 3000;
  private idReceptorUser: number;
  private currentInfoSubscribe;
  private idUsuarioChat;
  listenerMessages: any;
  subscriptionMessages: any;
  imagenChat;
  nameUser;
  messages: any;
  formMessage: FormGroup;
  showSpinner: boolean = true;
  inicioConversacion: boolean = false;
  showDeleteButton = false;
  rol;
  isSendMessage = false;
  price;
  currentUrl = this.router.url;
  idUsuarioVendedor;
  rating;
  nombreUsuarioChat;
  public paymentTypes = {
    cash: 'Efectivo',
    bank_account_transfer: 'Transferencia bancaria',
    qr_code_transfer: 'Código QR',
    sufi_credit: 'Crédito SUFI',
    na: 'No aplica'
  };
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  @Output() close: EventEmitter<any> = new EventEmitter();

  @ViewChild('scrollMe') private ScrollContainer: ElementRef;

  constructor(
    private messagesService: MessagesService,
    private currentSessionService: CurrentSessionService,
    private shareInfoChatService: ShareInfoChatService,
    private offerService: OfferService,
    private buyService: BuyService,
    private router: Router,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.userId = this.currentSessionService.getIdUser();
    this.formMessage = new FormGroup({
      message: new FormControl('', [Validators.required])
    });
    this.shareInfoChatService.setScrollDown(true);
    this.currentInfoSubscribe = this.shareInfoChatService.currentInfoMessage.subscribe(
      currentConversation => {
        if (currentConversation) {

          this.rol = currentConversation.rol;
          this.showDeleteButton = currentConversation.tieneAccionesPendientes;
          this.imagenChat = currentConversation.fotoEmisario;
          this.nameUser = currentConversation.nombreEmisario;
          this.messages = currentConversation.mensajes;
          this.price = currentConversation.precio;
          this.idUsuarioVendedor = currentConversation.idUsuarioVendedor;
          this.idReceptorUser = currentConversation.idEmisario;
          this.rating = currentConversation.calificacion;
          this.nombreUsuarioChat = currentConversation.nombreUsuarioChat;
          if (currentConversation.idUsuarioChat) {
            this.idUsuarioChat = currentConversation.idUsuarioChat;
          }
          this.showSpinner = false;
          if (currentConversation.inicioConversacion) {
            this.inicioConversacion = currentConversation.inicioConversacion;
          }
          if (this.rol == 'product') {
            const params = {
              idEmisor: this.idUsuarioChat,
              idProducto: this.idReceptorUser
            };
            this.updateConversationStatus(params);
          } else {
            const params = {
              idEmisor: this.idReceptorUser
            };
            this.updateConversationStatus(params);
          }
          this.onLoadWindow(this.showSpinner);
        }
      }
    );
  }

  onLoadWindow(ev) {
    this.notify.emit(ev);
  }

  closeChatWindow() {
    this.close.emit();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  get showMessageFeedBack() {
    this.currentUrl = this.router.url;
    return (
      this.rol === 'admin' &&
      this.currentUrl ===
        `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.MESSAGES}/${
          ROUTES.MENUROTALOCENTER.FEEDBACK
        }`
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.listenerMessages);
    this.currentInfoSubscribe.unsubscribe();
    if (this.subscriptionMessages) {
      this.subscriptionMessages.unsubscribe();
    }
  }

  isScrollBottom() {
    return this.shareInfoChatService.getScrollDown();
  }

  scrollToBottom(): void {
    try {
      if (this.ScrollContainer) {
        if (this.isScrollBottom()) {
          this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight;
          this.shareInfoChatService.setScrollDown(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  updateSrc(evt) {
    evt.currentTarget.src = this.defaultImage;
  }

  isSender(message): boolean {
    if (this.rol == 'admin' || this.rol == 'user') {
      return this.userId == message.idEmisor;
    }
    if (this.rol == 'product') {
      if (
        this.idUsuarioVendedor == this.userId &&
        message.idEmisor == this.idReceptorUser
      ) {
        return true;
      } else {
        return this.userId == message.idEmisor;
      }
    }
  }

  isSellerWindow() {
    return this.idUsuarioVendedor == this.userId;
  }

  onSubmit() {
    let params;
    if (this.rol == 'product') {
      params = {
        idProducto: this.idReceptorUser,
        idUsuarioDestinatario: this.idUsuarioChat,
        mensaje: this.formMessage.controls['message'].value
      };
    } else {
      params = {
        idUsuarioDestinatario: this.idReceptorUser,
        mensaje: this.formMessage.controls['message'].value
      };
    }

    this.formMessage.reset();
    this.subscriptionMessages = this.messagesService
      .sendMessage(params)
      .subscribe(
        state => {
          if (this.rol === 'admin') {
            this.isSendMessage = true;
          }
        },
        error => console.log(error)
      );
  }

  private updateConversationStatus(params) {
    this.subscriptionMessages = this.messagesService
      .updateMessage(params)
      .subscribe(state => {}, error => console.log(error));
  }

  goToDetail(notification) {
    const id = notification.producto.idProducto;
    this.router.navigate([
      `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${id}`
    ]);
  }

  goToProduct() {
    if (this.rol == 'product') {
      this.router.navigate([
        `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${this.idReceptorUser}`
      ]);
    }
  }

  goToHobbies() {
    this.router.navigate([`/${ROUTES.PROFILE}/${ROUTES.HOBBIES}`]);
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

  private buildParamsOffer(notification): any {
    let esSubasta = false;
    if (notification.producto.tipoVenta === 'SUBASTA') {
      esSubasta = true;
    }
    return {
      emailOfertador: notification.oferta.emailOfertador,
      nombreOfertador: notification.oferta.nombreUsuario,
      nombreVendedor: notification.producto.nombreUsuario,
      montoOferta: notification.oferta.monto,
      nombreProducto: notification.producto.nombreProducto,
      esSubasta: esSubasta,
      idProducto: notification.producto.idProducto
    };
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

  private buildParamsRegretOffer(notification): any {
    return {
      emailVendedor: notification.producto.emailVendedor,
      nombreVendedor: notification.producto.nombreUsuario,
      nombreProducto: notification.producto.nombreProducto,
      montoOferta: notification.oferta.monto,
      nombreOfertador: notification.oferta.nombreUsuario,
      idProducto: notification.producto.idProducto,
      idVendedor: notification.producto.idVendedor
    };
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

  buyProduct(mensaje) {
    const id = mensaje.producto.idProducto;
    this.router.navigate([
      `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.BUY}/${id}`
    ]);
  }

  republish(notification) {
    const id = notification.producto.idProducto;
    const param = {
      idNotificacion: notification.idNotificacion,
      idProducto: id
    };
    const result = confirm(
      'Al republicar verifica que las imágenes muestren bien los atributos y beneficios de tu producto. Además, revisa que el precio sea adecuado y considera “Recibir ofertas” de los compradores.'
    );
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

  updateSellUnknow(notification, type: String) {
    const param = {
      idNotificacion: notification.idNotificacion,
      estado: type
    };
    this.messagesService.updateSellUnknow(param).subscribe(
      state => {
        if (type === 'out') {
          notification.accionExpirado = 'sell_unknow_out';
        } else {
          notification.accionExpirado = 'sell_unknow_in';
        }
      },
      error => console.log(error)
    );
  }

  returnTotalPurchase(notification) {
    let amountPurchase = 0;
    if (notification.informacionAdicional) {
      const obj = JSON.parse(notification.informacionAdicional);
      amountPurchase = obj.total_order;
    }
    return amountPurchase;
  }
}
