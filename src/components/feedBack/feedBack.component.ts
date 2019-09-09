import { OnInit, Component } from '@angular/core';
import { ModalFeedBackService } from '../modal-feedBack/modal-feedBack.service';
import { Router } from '@angular/router';
import { CurrentSessionService } from '../../services/current-session.service';
import { ROUTES } from '../../router/routes';
import { ShareInfoChatService } from '../chat-thread/shareInfoChat.service';

@Component({
  selector: 'feed-back',
  templateUrl: './feedBack.component.html',
  styleUrls: ['./feedBack.component.scss']
})
export class FeedBackComponent implements OnInit {
  private currentUrl = '';
  constructor(private modalService: ModalFeedBackService,
    private router: Router,
    private currentSessionService: CurrentSessionService,
    private shareInfoChatService: ShareInfoChatService) {
  }

  ngOnInit() {
    this.router.events.subscribe((val) => {
      this.currentUrl = this.router.url;
    });
  }

  public checkSession() {
    return this.currentSessionService.currentUser();
  }

  public get isStore() {
    const currentUrl = window.location.href;
    if (currentUrl.includes(ROUTES.SHOPSPRIVATE.LINK) ||
    currentUrl.includes(ROUTES.SHOPS.LINK)) {
      return true;
    }
    return false;
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
