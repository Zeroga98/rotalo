import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ShareInfoChatService } from '../../components/chat-thread/shareInfoChat.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../router/routes';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit, OnDestroy {
  showSpinner:boolean = true;
  currentUrl = this.router.url;
  constructor( private shareInfoChatService: ShareInfoChatService , private router: Router) { }
  screenWidth;
  showChatThreads = 'block';
  showChatWindow = 'blok';

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 800) {
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
    if (this.isFeedBackPage()) {
      this.receiveOption();
    }
    this.shareInfoChatService.change.subscribe(isOpen => {
      if (isOpen) {
        this.receiveOption();
      }
    });
  }

  isFeedBackPage() {
    return this.currentUrl === `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.MESSAGES}/${ROUTES.MENUROTALOCENTER.FEEDBACK}`;
  }


  ngOnDestroy(): void {
    this.shareInfoChatService.setIdConversation(undefined);
    this.shareInfoChatService.changeMessage(undefined);
    this.shareInfoChatService.setNewConversation(undefined);
    this.shareInfoChatService.setFirstConversation(undefined);
  }

  onNotify(ev): void {
    this.showSpinner = ev;
  }

  receiveOption() {
    if (this.screenWidth <= 800) {
      this.showChatThreads = 'none';
      this.showChatWindow = 'block';
      window.scroll(0, 0);
    }
  }

  closeWindowChat() {
    if (this.screenWidth <= 800) {
      this.showChatThreads = 'block';
      this.showChatWindow = 'none';
    }
  }

}
