import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';

@Injectable()
export class ShareInfoChatService {
  private messageInfoSource = new BehaviorSubject<any>(null);
  currentInfoMessage = this.messageInfoSource.asObservable();
  @Output()  change: EventEmitter<boolean> = new EventEmitter();

  private newConversation;
  private idConversation;
  private firstThread;
  private scrollDown = true;
  private adminThread;
  private productUserId;

  constructor() {}

  feedBackAdmin() {
    this.change.emit(true);
  }

  changeMessage(messageInfo) {
    this.messageInfoSource.next(messageInfo);
  }

  setScrollDown(scrollDown) {
    this.scrollDown = scrollDown;
  }

  getScrollDown() {
    return this.scrollDown;
  }

  setProductUserId(id) {
    this.productUserId = id;
  }

  getProductUserId() {
    return this.productUserId;
  }

  setIdConversation(id) {
    this.idConversation = id;
  }

  getIdConversation() {
    return this.idConversation;
  }

  setNewConversation(newConversation) {
    this.newConversation = newConversation;
  }

  getNewConversation() {
    return this.newConversation;
  }

  setFirstConversation(firstThread) {
    this.firstThread = firstThread;
  }

  getFirstConversation() {
    return this.firstThread;
  }

  setAdminConversation(adminThread) {
    this.adminThread = adminThread;
  }

  getAdminConversation() {
    return this.adminThread;
  }

}
