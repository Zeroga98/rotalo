import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from "@angular/core";
import { MessagesService } from "../../services/messages.service";
import { CurrentSessionService } from "../../services/current-session.service";
import { ShareInfoChatService } from "../chat-thread/shareInfoChat.service";

@Component({
  selector: "chat-threads",
  templateUrl: "./chat-threads.component.html",
  styleUrls: ["./chat-threads.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatThreadsComponent implements OnInit, OnDestroy {
  private readonly timeToCheckNotification: number = 5000;
  threads: any;
  firstThread: any;
  userId: any;
  intervalConversation:any;
  subscriptionConversation: any;

  constructor(
    private messagesService: MessagesService,
    private changeDetector: ChangeDetectorRef,
    private currentSessionService: CurrentSessionService,
    private shareInfoChatService: ShareInfoChatService
  ) {}

  ngOnInit() {
    this.userId = this.currentSessionService.getIdUser();
    this.intervalConversation = this.getMessages(this.userId);
    this.changeDetector.markForCheck();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalConversation);
    if (this.subscriptionConversation){
      this.subscriptionConversation.unsubscribe();
    }
  }

  private getMessages(userId) {
    return setInterval(() => {
   this.subscriptionConversation = this.messagesService.getMessages(userId).subscribe(
      state => {
        if (state.body && state.body.emisarios) {
          if (!this.threads) {
            this.threads = state.body.emisarios;
            if (!this.shareInfoChatService.getIdConversation()) {
              this.firstThread = this.threads[0];
              this.shareInfoChatService.setIdConversation(this.firstThread.idEmisario);
              this.shareInfoChatService.changeMessage(this.firstThread);
            }else {
              const currentThread = this.searchCurrentConversation(this.shareInfoChatService.getIdConversation(), this.threads);
                if (currentThread) {
                  this.shareInfoChatService.changeMessage(currentThread);
                  this.shareInfoChatService.setNewConversation(undefined);
                }else {
                  this.threads.splice(1, 0, this.shareInfoChatService.getNewConversation());
                  this.shareInfoChatService.changeMessage(this.shareInfoChatService.getNewConversation());
                }
            }
          } else {
            if ( JSON.stringify(this.threads) !== JSON.stringify(state.body.emisarios)) {
              if (this.shareInfoChatService.getIdConversation()) {
                this.threads = state.body.emisarios;
                const currentThread = this.searchCurrentConversation(this.shareInfoChatService.getIdConversation(), this.threads);

                if (currentThread) {
                  this.shareInfoChatService.changeMessage(currentThread);
                  if (this.shareInfoChatService.getNewConversation()) {
                    /*this.threads.splice(1, 0, this.shareInfoChatService.getNewConversation());*/
                  }
                }else {
                  this.threads.splice(1, 0, this.shareInfoChatService.getNewConversation());
                  this.shareInfoChatService.changeMessage(this.shareInfoChatService.getNewConversation());
                }
              }
            }
          }
        }
        this.changeDetector.markForCheck();
      },
      error => console.log(error)
    );
    }, this.timeToCheckNotification);
  }
  private searchCurrentConversation(currentThreadId, threads) {
    return threads.find(thread => {
        return thread.idEmisario == currentThreadId;
    });
  }
}
