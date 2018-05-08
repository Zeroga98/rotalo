import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessagesService } from "../../services/messages.service";
import { CurrentSessionService } from "../../services/current-session.service";
import { ShareInfoChatService } from "../chat-thread/shareInfoChat.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { OfferService } from "../../services/offer.service";
import { BuyService } from "../../services/buy.service";
import { ROUTES } from "../../router/routes";

@Component({
  selector: "chat-window",
  templateUrl: "./chat-window.component.html",
  styleUrls: ["./chat-window.component.scss"]
})
export class ChatWindowComponent implements OnInit, OnDestroy, AfterViewChecked {
  readonly defaultImage: string = "../assets/img/user_sin_foto.svg";
  private idUserConversation;
  private userId;
  private readonly timeToCheckNotification: number = 5000;
  private idReceptorUser: number;
  private currentInfoSubscribe;
  listenerMessages: any;
  subscriptionMessages: any;
  imagenChat;
  nameUser;
  messages: any;
  formMessage: FormGroup;
  showSpinner: boolean = true;
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('scrollMe') private ScrollContainer: ElementRef;

  constructor(
    private messagesService: MessagesService,
    private currentSessionService: CurrentSessionService,
    private shareInfoChatService: ShareInfoChatService,
    private offerService: OfferService,
    private buyService: BuyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.currentSessionService.getIdUser();
    this.formMessage = new FormGroup({
      message: new FormControl("", [Validators.required])
    });
    this.currentInfoSubscribe = this.shareInfoChatService.currentInfoMessage.subscribe(currentConversation => {
      if (currentConversation) {
          this.imagenChat = currentConversation.fotoEmisario;
          this.nameUser = currentConversation.nombreEmisario;
          this.messages = currentConversation.mensajes;
          this.idReceptorUser = currentConversation.idEmisario;
          this.showSpinner = false;
          this.onLoadWindow(this.showSpinner);
      }
    });
  }

  onLoadWindow(ev) {
    this.notify.emit(ev);
  }

  ngAfterViewChecked() {
   // this.scrollToBottom();
  }

  ngOnDestroy(): void {
    clearInterval(this.listenerMessages);
    this.currentInfoSubscribe.unsubscribe();
    if (this.subscriptionMessages) { this.subscriptionMessages.unsubscribe(); }
  }

  scrollToBottom(): void {
    try {
        this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight;
    } catch (err) { console.log(err); }
  }

  updateSrc(evt) {
    evt.currentTarget.src = this.defaultImage;
  }

  isSender(id): boolean {
    return this.userId == id;
  }

  onSubmit() {
      const params = {
        idUsuarioDestinatario: this.idReceptorUser,
        mensaje: this.formMessage.controls["message"].value,
      };
      this.subscriptionMessages = this.messagesService.sendMessage(params, this.userId)
      .subscribe(
        state => {
          this.formMessage.reset();
        },
        error => console.log(error)
      );
  }

  private updateConversationStatus(userId) {
    const params = {
      idEmisor: userId,
    };
    this.subscriptionMessages = this.messagesService.updateMessage(params,  this.userId)
    .subscribe(
      state => {
        console.log(state);
      },
      error => console.log(error)
    );
  }


  goToDetail(notification) {
    const id = notification.producto.idProducto;
    this.router.navigate([
      `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${id}`
    ]);
  }

  async acceptOffer(notification) {
    try {
      if (!confirm('¿Estás seguro que deseas aceptar la oferta?')) return;
      const response = await this.offerService.acceptOffer(notification.oferta
        .idOferta as number);
      notification.status = 'Oferta aceptada';
    } catch (error) {
      console.error(error);
    }
  }

  async declineOffer(notification) {
    try {
      if (!confirm('¿Estás seguro que deseas rechazar la oferta?')) return;
      const response = await this.offerService.declineOffer(notification.oferta
        .idOferta as number);
      notification.status = 'Oferta rechazada';
    } catch (error) {
      console.error(error);
    }
  }

  buyProduct(mensaje) {
    const id = mensaje.producto.idProducto;
    this.router.navigate([`${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.BUY}/${id}`]);
  }

  async regretOffer(notification){
    try {
      if (!confirm("¿Estás seguro que deseas cancelar la compra?")) return;
      const response = await this.offerService.regretOffer(notification.oferta.idOferta as number);
      notification.status = "Compra cancelada";
    } catch (error) {
      console.error(error);
    }
  }


}
