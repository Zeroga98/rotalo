import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ROUTES } from '../../router/routes';
import { Router } from '@angular/router';
import { ShareInfoChatService } from './shareInfoChat.service';


@Component({
  selector: 'chat-thread',
  templateUrl: './chat-thread.component.html',
  styleUrls: ['./chat-thread.component.scss']
})
export class ChatThreadComponent implements OnInit {
  @Input() thread;

  readonly defaultImage: string = '../assets/img/user_sin_foto.svg';
  constructor(private router: Router, private shareInfoChatService: ShareInfoChatService) {}
  @Output() selectOption: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    if (this.shareInfoChatService.getIdConversation() == this.thread.idEmisario) {
      this.shareInfoChatService.changeMessage(this.thread);
    }
  }

  updateSrc(evt) {
    evt.currentTarget.src = this.defaultImage;
  }

  selectInfoConversation() {
    this.shareInfoChatService.setIdConversation(this.thread.idEmisario);
    this.shareInfoChatService.changeMessage(this.thread);
    this.selectOption.emit();
  }

  isSelected() {
    const currentId = this.shareInfoChatService.getIdConversation();
    return currentId == this.thread.idEmisario;
  }

}
