import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessagesService } from "../../services/messages.service";
import { CurrentSessionService } from "../../services/current-session.service";
import { ShareInfoChatService } from "../chat-thread/shareInfoChat.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "../../services/user.service";

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
  listenerMessages: any;
  subscriptionMessages: any;
  private idReceptorUser: number;
  imagenChat;
  nameUser;
  messages: any;
  formMessage: FormGroup;
  private currentInfoSubscribe;
  @ViewChild('scrollMe') private ScrollContainer: ElementRef;

  constructor(
    private messagesService: MessagesService,
    private currentSessionService: CurrentSessionService,
    private shareInfoChatService: ShareInfoChatService
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

      }
    });
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

}
