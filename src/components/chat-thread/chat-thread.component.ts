import { Component, OnInit, Input } from "@angular/core";
import { ROUTES } from "../../router/routes";
import { Router } from "@angular/router";

@Component({
  selector: "chat-thread",
  templateUrl: "./chat-thread.component.html",
  styleUrls: ["./chat-thread.component.scss"]
})
export class ChatThreadComponent implements OnInit {
  @Input() thread;
  selected = false;
  readonly defaultImage: string = "../assets/img/product-no-image.png";
  constructor(private router: Router) {}

  ngOnInit() {}

  updateSrc(evt) {
    evt.currentTarget.src = this.defaultImage;
  }

  selectConversation(idConversation) {
    const routeConversation = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.MESSAGES}/${ROUTES.MENUROTALOCENTER.CONVERSATION}/${idConversation}`;
    console.log(routeConversation);
    return routeConversation;
//console.log(routeConversation);
   // this.router.navigate([routeConversation]);
  }
}
