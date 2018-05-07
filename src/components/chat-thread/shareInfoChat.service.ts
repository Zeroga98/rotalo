import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ShareInfoChatService {

  private messageInfoSource = new BehaviorSubject<any>(null);
  currentInfoMessage = this.messageInfoSource.asObservable();

  private idConversation;

  constructor() {}

  changeMessage(messageInfo) {
    this.messageInfoSource.next(messageInfo);
  }

  setIdConversation(id){
    this.idConversation = id;
  }

  getIdConversation() {
    return this.idConversation;
  }

}
