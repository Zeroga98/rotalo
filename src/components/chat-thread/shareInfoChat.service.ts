import { Injectable } from "@angular/core";

@Injectable()
export class ShareInfoChatService {
  private thread;
  constructor() {}

  setThread(thread) {
    this.thread = thread;
  }

  getThread() {
    console.log( this.thread, ' this.thread');
    return this.thread;
  }
}
