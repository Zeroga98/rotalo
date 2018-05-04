import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessagesService } from "../../services/messages.service";
import { CurrentSessionService } from "../../services/current-session.service";
import { ShareInfoChatService } from "../chat-thread/shareInfoChat.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "chat-window",
  templateUrl: "./chat-window.component.html",
  styleUrls: ["./chat-window.component.scss"]
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  idUserMessage: number = parseInt(this.router.url.replace(/[^\d]/g, ""));
  private idUserConversation;
  private userId;
  private readonly timeToCheckNotification: number = 5000;
  listenerMessages: any;
  messages: any;
  subscriptionMessages: any;
  imagenChat;
  conversationInfo;
  formMessage: FormGroup;
  constructor(
    private router: Router,
    private messagesService: MessagesService,
    private currentSessionService: CurrentSessionService,
    private route: ActivatedRoute,
    private shareInfoChatService: ShareInfoChatService
  ) {}

  ngOnInit() {
    this.formMessage = new FormGroup({
      message: new FormControl("", [Validators.required])
    });
    this.userId = this.currentSessionService.getIdUser();
    this.updateConversationStatus(this.userId);
    this.route.params.subscribe(params => {
      this.messages = [];
      this.idUserConversation = params.id;
      this.listenerMessages = this.getConversationMessages(
        this.userId,
        this.idUserConversation
      );

    });
  }

  ngOnDestroy(): void {
    clearInterval(this.listenerMessages);
  }

  onSubmit() {
      const params = {
        idUsuarioDestinatario: this.idUserMessage,
        mensaje: this.formMessage.controls["message"].value,
      };
      this.subscriptionMessages = this.messagesService.sendMessage(params, this.userId)
      .subscribe(
        state => {
          console.log(state)
        },
        error => console.log(error)
      );
  }

  private updateConversationStatus(userId){
    const params = {
      idEmisor: userId,
    };
    this.subscriptionMessages = this.messagesService.updateMessage(params, userId)
    .subscribe(
      state => {
        console.log(state)
      },
      error => console.log(error)
    );
  }

  private getConversationMessages(currentUser, userIdEmit) {
    if (this.subscriptionMessages) {
      this.subscriptionMessages.unsubscribe();
      clearInterval(this.listenerMessages);
    }
    return setInterval(() => {
      this.subscriptionMessages = this.messagesService
        .getConversationMessages(currentUser, userIdEmit)
        .subscribe(
          state => {
            this.messages = state.body.mensajes;
          },
          error => console.log(error)
        );
    }, this.timeToCheckNotification);
  }

  public isSender(id): boolean {
    return this.userId == id;
  }
}
