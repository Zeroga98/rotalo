import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShareInfoChatService } from '../../components/chat-thread/shareInfoChat.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit, OnDestroy {
  showSpinner:boolean = true;
  constructor( private shareInfoChatService: ShareInfoChatService) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.shareInfoChatService.setIdConversation(undefined);
    this.shareInfoChatService.changeMessage(undefined);
    this.shareInfoChatService.setNewConversation(undefined);
  }

  onNotify(ev): void {
    this.showSpinner = ev;
  }
}
