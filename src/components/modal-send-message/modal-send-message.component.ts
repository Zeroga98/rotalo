import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { ConversationInterface } from '../../commons/interfaces/conversation.interface';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'modal-send-message',
  templateUrl: './modal-send-message.component.html',
  styleUrls: ['./modal-send-message.component.scss']
})
export class ModalSendMessageComponent implements OnInit {
  public conversation: Array<ConversationInterface> = [];

  constructor(private messagesService: MessagesService, private productsService: ProductsService) { }

  ngOnInit() {
    this.loadConversation();
  }

  loadConversation() {
    this.messagesService.getConversationByID("1741-3061").then(conver => {
      this.conversation = conver;
      console.log(this.conversation);
      console.log(this.messagesService.getConversationByID("1741-3061"));
      console.log(this.productsService.getProductsById(1741));
    });
  }

}
