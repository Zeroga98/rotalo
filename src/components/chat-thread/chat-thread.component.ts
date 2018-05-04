import { Component, OnInit, Input } from "@angular/core";
import { ROUTES } from "../../router/routes";
import { Router } from "@angular/router";
import { ShareInfoChatService } from "./shareInfoChat.service";

@Component({
  selector: "chat-thread",
  templateUrl: "./chat-thread.component.html",
  styleUrls: ["./chat-thread.component.scss"]
})
export class ChatThreadComponent implements OnInit {
  @Input() thread;
  @Input() first;
  selected = false;
  readonly defaultImage: string = "../assets/img/user_sin_foto.svg";
  constructor(private router: Router, private shareInfoChatService: ShareInfoChatService) {}

  ngOnInit() {
    if (this.first === 0) {
      this.shareInfoChatService.setThread(this.thread);
    }
  }

  updateSrc(evt) {
    evt.currentTarget.src = this.defaultImage;
  }

  sendThread() {
    this.shareInfoChatService.setThread(this.thread);
  }

  selectConversation(idConversation) {
    const routeConversation =
    `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.MESSAGES}/${ROUTES.MENUROTALOCENTER.CONVERSATION}/${idConversation}`;
    return routeConversation;
  }
}
