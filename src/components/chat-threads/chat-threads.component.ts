import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { ShareInfoChatService } from '../chat-thread/shareInfoChat.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DeleteConversationComponent } from './delete-conversation/delete-conversation.component';

@Component({
  selector: 'chat-threads',
  templateUrl: './chat-threads.component.html',
  styleUrls: ['./chat-threads.component.scss'],
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
  selectAllCheck = false;


  constructor(
    private messagesService: MessagesService,
    private changeDetector: ChangeDetectorRef,
    private currentSessionService: CurrentSessionService,
    private shareInfoChatService: ShareInfoChatService,
    public dialog: MatDialog
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
    this.subscriptionConversation = this.messagesService.getMessages().subscribe(
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
            } else {
              const currentThread = this.searchCurrentConversation(this.shareInfoChatService.getIdConversation(), this.threads);
                if (currentThread) {
                  this.shareInfoChatService.changeMessage(currentThread);
                  this.shareInfoChatService.setNewConversation(undefined);
                } else {
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
                } else {
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
        return thread.idEmisario == currentThreadId || thread.idUsuarioChat && thread.idUsuarioChat == currentThreadId ;
    });
  }

  selectAll() {
    const container = document.getElementById('conversation-wrap');
    const inputs = container.getElementsByTagName('input');
    this.selectAllCheck = !this.selectAllCheck;
    for (let i = 1; i < inputs.length; ++i) {
      inputs[i].checked = this.selectAllCheck;
    }
    this.changeDetector.markForCheck();
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '300px';
    dialogConfig.maxHeight = '500px';
    dialogConfig.width = '60%';
    dialogConfig.height = '70%';
    dialogConfig.autoFocus = false;
    const container = document.getElementById('conversation-wrap');
    const inputs = container.getElementsByTagName('input');

    const arrayToDelete = [];
    for (let i = 1; i < inputs.length; ++i) {
      if (inputs[i].checked == true) {
        if (inputs[i].id.includes('_')) {
          const array = inputs[i].id.split('_');
          const userProduct = {
            'idUsuario': parseInt(array[1]),
            'idProducto': parseInt(array[0])
          };
          arrayToDelete.push(userProduct);
        } else {
          const userProduct = {
            'idUsuario': parseInt(inputs[i].id)
          };
          arrayToDelete.push(userProduct);
        }
      }
    }

    if (arrayToDelete.length > 0) {
      const params = {
        usuarios: arrayToDelete
      };
      dialogConfig.data = params;
      const dialogRef = this.dialog.open(DeleteConversationComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.messagesService.deleteMessage(result).subscribe((response) => {
            location.reload();
          },
          (error) => {
            console.log(error);
          });
        }
      });
    }
  }

}
