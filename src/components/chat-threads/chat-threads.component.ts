import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { CurrentSessionService } from '../../services/current-session.service';

@Component({
  selector: 'chat-threads',
  templateUrl: './chat-threads.component.html',
  styleUrls: ['./chat-threads.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatThreadsComponent implements OnInit , OnDestroy {
  private readonly timeToCheckNotification: number = 5000;
  threads: any;
  userId: any;
  constructor(private messagesService: MessagesService,
      private changeDetector: ChangeDetectorRef,
     private currentSessionService: CurrentSessionService) { }

  ngOnInit() {
    this.userId = this.currentSessionService.getIdUser();
    this.getMessages(this.userId);
    this.changeDetector.markForCheck();
  }

  ngOnDestroy(): void {
    clearInterval(this.threads);
  }

  private  getMessages(userId) {
    // return setInterval(() => {
      this.messagesService.getMessages("41").subscribe(
        state => {
          this.threads = state.body.emisarios;
          console.log(state);
          this.changeDetector.markForCheck();
        },
        error => console.log(error)
      );
   // }, this.timeToCheckNotification);
  }

}
