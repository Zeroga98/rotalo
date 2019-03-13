import { OnInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalFeedBackService } from '../../../components/modal-feedBack/modal-feedBack.service';
import { CurrentSessionService } from '../../../services/current-session.service';
import { ShareInfoChatService } from '../../../components/chat-thread/shareInfoChat.service';


@Component({
  selector: 'feed-back-microsite',
  templateUrl: './feedBackMicrosite.component.html',
  styleUrls: ['./feedBackMicrosite.component.scss']
})
export class FeedBackMicrositeComponent implements OnInit {
  public currentUrl = '';
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
    return this.currentUrl && this.currentUrl.includes('microsite');
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
