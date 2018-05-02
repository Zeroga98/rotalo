import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessagesService } from '../../services/messages.service';
import { CurrentSessionService } from '../../services/current-session.service';

@Component({
  selector: 'chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  private idUserConversation;
  private userId;
  private readonly timeToCheckNotification: number = 5000;
  listenerMessages: any;
  messages:any;
  constructor(private messagesService: MessagesService,
    private currentSessionService: CurrentSessionService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.userId = this.currentSessionService.getIdUser();
    this.userId = "41"
    this.route.params.subscribe( params => {
      this.idUserConversation = params.id;
      this.listenerMessages = this.getConversationMessages( this.userId , this.idUserConversation );
      console.log(this.listenerMessages);
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.listenerMessages);
  }

  private  getConversationMessages(currentUser, userIdEmit) {
    return setInterval(() => {
      this.messagesService.getConversationMessages(currentUser, userIdEmit).subscribe(
        state => {
         this.messages =  state.body.mensajes;
         console.log(this.messages);
        },
        error => console.log(error)
      );
    }, this.timeToCheckNotification);
  }

  public isSender (id): boolean {
    console.log(this.userId);
    console.log(id);
    console.log(this.userId == id);
    return this.userId == id;
  }

}
