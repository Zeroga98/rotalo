import { OnInit, Component } from "@angular/core";
import { ModalFeedBackService } from "../modal-feedBack/modal-feedBack.service";
import { Router } from "@angular/router";
import { CurrentSessionService } from "../../services/current-session.service";
import { ROUTES } from "../../router/routes";

@Component({
  selector: "feed-back",
  templateUrl: "./feedBack.component.html",
  styleUrls: ["./feedBack.component.scss"]
})
export class FeedBackComponent implements OnInit {
  private currentUrl = '';
  constructor(private modalService: ModalFeedBackService,
    private router: Router,
    private currentSessionService: CurrentSessionService) {
  }

  ngOnInit() {
    this.router.events.subscribe((val) => {
      this.currentUrl = this.router.url;
    });
  }

  private checkSession() {
    return this.currentSessionService.currentUser();
  }

  openModal(id: string) {
    if (this.checkSession()) {
      this.router.navigate(
        [`/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.MESSAGES}/${ROUTES.MENUROTALOCENTER.FEEDBACK}`]);
    }else {
      this.modalService.open(id);
    }
  }

  get showFeedBack() {
    return this.currentUrl !== `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`;
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
