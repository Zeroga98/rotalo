import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ShareInfoChatService } from '../../components/chat-thread/shareInfoChat.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit, OnDestroy {
  showSpinner:boolean = true;
  constructor( private shareInfoChatService: ShareInfoChatService) { }
  screenWidth;
  showChatThreads = 'block';
  showChatWindow = 'blok';

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 700) {
      this.showChatWindow = 'block';
      this.showChatThreads = 'block';
    }else {
      if ( this.showChatThreads !== 'none') {
        this.showChatWindow = 'none';
        this.showChatThreads = 'block';
      }
    }
  }

  ngOnInit() {
    this.onResize();
  }

  ngOnDestroy(): void {
    this.shareInfoChatService.setIdConversation(undefined);
    this.shareInfoChatService.changeMessage(undefined);
    this.shareInfoChatService.setNewConversation(undefined);
  }

  onNotify(ev): void {
    this.showSpinner = ev;
  }

  receiveOption() {
    if (this.screenWidth <= 700) {
      this.showChatThreads = 'none';
      this.showChatWindow = 'block';
      window.scroll(0, 0);
    }
  }

  closeWindowChat() {
    if (this.screenWidth <= 700) {
      this.showChatThreads = 'block';
      this.showChatWindow = 'none';
    }
  }

}
