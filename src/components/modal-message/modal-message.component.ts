import { Component, OnInit, Output } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { ConversationInterface } from '../../commons/interfaces/conversation.interface';

@Component({
  selector: 'modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.scss']
})
export class ModalMessageComponent implements OnInit {
  idConversation: string = "";
  public conversations: Array<ConversationInterface> = [];
  showMessage: boolean = false;

  constructor(private messagesService: MessagesService) { }

  ngOnInit() {
    this.loadMessage();
  }

  loadMessage() {
    this.messagesService.getConversation().then(conver => {
      this.conversations = [].concat(conver);
      console.log(this.conversations);
    });
  }

  getUrlImage(name: string) {
    return `url('${name}')`;
  }

  sendIdConversation(id: string) {
    this.idConversation = id;
    this.showMessage = true;
  }

  showModal(): boolean {
    return this.conversations.length > 0;
  }

}
