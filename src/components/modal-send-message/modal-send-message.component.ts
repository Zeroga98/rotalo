import { Component, OnInit, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from "@angular/core";
import { MessagesService } from "../../services/messages.service";
import { ConversationInterface } from "../../commons/interfaces/conversation.interface";
import { ProductsService } from "../../services/products.service";
import { MessageInterface } from "../../commons/interfaces/message.interface";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { CurrentSessionService } from "../../services/current-session.service";

@Component({
  selector: "modal-send-message",
  templateUrl: "./modal-send-message.component.html",
  styleUrls: ["./modal-send-message.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalSendMessageComponent implements OnInit {
  @Input() idConversation: string;
  @Input() idProduct: string;
  @Input() idUserProduct: string;
  @Input() conversationDefault: ConversationInterface;
  @Output() close: EventEmitter<any> = new EventEmitter();

  public conversation: Array<ConversationInterface> = [];
  public conversations: Array<ConversationInterface> = [];
  messages: Array<MessageInterface> = [];
  formMessage: FormGroup;
  idUser: string = this.currentSessionSevice.getIdUser();
  constructor(
    private messagesService: MessagesService,
    private currentSessionSevice: CurrentSessionService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // this.loadMessage();
  }

  validateForm() {
    this.formMessage = new FormGroup({
      message: new FormControl("", [Validators.required])
    });
  }

 /* loadConversation(idMessage) {
    this.messagesService.getConversationByID(idMessage).then(conver => {
      this.conversation = [].concat(conver);
      this.messages = [].concat(this.conversation[0].messages);
      this.changeDetectorRef.markForCheck();
    });
  }*/

 /* async loadMessage() {
    this.validateForm();
    try {
      const conver = await this.messagesService.getConversation();
      this.conversations = [].concat(conver);
      if (this.conversation.length == 0) {
        this.conversation = [].concat(this.conversationDefault);
      }
      this.conversations.forEach(item => {
        if (item.id === this.idConversation) {
          this.loadConversation(this.idConversation);
        } else if (item.id === this.idProduct + "-" + this.idUser) {
          this.loadConversation(this.idProduct + "-" + this.idUser);
        } else {
          this.conversation = [].concat(this.conversationDefault);
        }
      });
      this.changeDetectorRef.markForCheck();
    } catch (error) {}
  }*/

  showModal(): boolean {
    return this.conversation.length > 0;
  }

  closeModal() {
    this.close.emit();
  }

  async onSubmit() {
    let date = new Date();

    try {
      if (!this.idProduct) {
        const idConversation = this.idConversation.split("-");
        this.idProduct = idConversation[0];
        this.idUser = idConversation[1];
      }
      const data = {
        "user-id": parseInt(this.idUser),
        content: this.formMessage.controls["message"].value,
        "product-id": this.idProduct
      };
     // const response = await this.messagesService.sendMessage(data);
    //  this.loadMessage();
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  getUrlImage() {
    if (this.conversation[0]) {
      return `url('${this.conversation[0].photo}')`;
    }
    return (`url('')`);
  }
}
