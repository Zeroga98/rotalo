import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
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
  @Output() selectOption: EventEmitter<any> = new EventEmitter();
  constructor(
    private messagesService: MessagesService,
    private changeDetector: ChangeDetectorRef,
    private currentSessionService: CurrentSessionService,
    private shareInfoChatService: ShareInfoChatService
  ) {}

  ngOnInit() {
    this.userId = this.currentSessionService.getIdUser();
    this.getMessages(this.userId);
    this.changeDetector.markForCheck();
  }

  ngOnDestroy(): void {
    if (this.subscriptionConversation) {
      this.subscriptionConversation.unsubscribe();
    }
  }

  receiveOption() {
    this.selectOption.emit();
  }

  private getMessages(userId) {
    this.subscriptionConversation = this.messagesService.getMessages(userId).subscribe(
      state => {
        if (state.body && state.body.emisarios) {
          if (!this.threads) {
            this.threads = state.body.emisarios;
            this.shareInfoChatService.setAdminConversation(this.threads[0]);
            this.shareInfoChatService.setFirstConversation(this.threads[0]);
            /*Se establece la primera conversacion admin*/
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
            this.shareInfoChatService.setAdminConversation(state.body.emisarios[0]);
            if ( JSON.stringify(this.threads) !== JSON.stringify(state.body.emisarios)) {
              if (this.shareInfoChatService.getIdConversation()) {
                this.threads = state.body.emisarios;
                const currentThread = this.searchCurrentConversation(this.shareInfoChatService.getIdConversation(), this.threads);
                if (currentThread) {
                  this.shareInfoChatService.changeMessage(currentThread);
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
  }

  private searchCurrentConversation(currentThreadId, threads) {
    return threads.find(thread => {
        return thread.idEmisario == currentThreadId;
    });
  }
}
