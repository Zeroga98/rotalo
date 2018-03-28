import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { ConversationInterface } from '../../commons/interfaces/conversation.interface';

@Component({
  selector: 'modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalMessageComponent implements OnInit {
  idConversation: string = "";
  public conversations: Array<ConversationInterface> = [];
  showMessage: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter();

  constructor(
    private messagesService: MessagesService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadMessage();
  }

  loadMessage() {
    this.messagesService.getConversation().then(conver => {
      this.conversations = [].concat(conver);
      this.changeDetectorRef.markForCheck();
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

  closeModal(){
    this.close.emit();
  }

  closeModalSendMessage(){
    this.showMessage = false;
  }

}
