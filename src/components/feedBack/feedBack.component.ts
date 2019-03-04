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

  openModal(id: string) {
    this.modalService.open(id);
   /* if (this.checkSession()) {
      if (this.currentUrl === `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.MESSAGES}/${ROUTES.MENUROTALOCENTER.FEEDBACK}`) {
        if (this.shareInfoChatService.getAdminConversation()) {
          this.shareInfoChatService.changeMessage(this.shareInfoChatService.getAdminConversation());
        }
      }
      this.router.navigate(
        [`/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.MESSAGES}/${ROUTES.MENUROTALOCENTER.FEEDBACK}`]);
      if (this.shareInfoChatService.getAdminConversation()) {
        this.shareInfoChatService.setScrollDown(true);
        this.shareInfoChatService.setIdConversation(this.shareInfoChatService.getAdminConversation().idEmisario);
      }
      this.shareInfoChatService.feedBackAdmin();
    } else {
      this.modalService.open(id);
    }*/
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
