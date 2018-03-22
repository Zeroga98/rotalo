
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/mergeMap';
import { UserInterface } from '../commons/interfaces/user.interface';
import { ConfigurationService } from '../services/configuration.service';

@Injectable()
export class MessagesService {
    currentUser: UserInterface;
    readonly url = this.configurationService.getBaseUrl() + '/v1/conversations';

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }

    getConversation(): Promise<any> {
        const url = `${this.url}`;
        console.log(url);
        return this.http.get(url).toPromise().then((response: any) => response.data);
    }

    getConversationByID(id: string): Promise<any> {
        const url = `${this.url}/${id}`;
        return this.http.get(url).toPromise().then((response: any) => response.data);
    }

    getConversationsUnread(): Promise<any> {
        return this.http.get(this.url)
                    .map( (conversations: any) => conversations.data)
                    .map( (conversations: any) => {
                        conversations = [].concat(conversations);
                        return conversations.filter( (conversation: any) => conversation['unread-count'] > 0);
                    })
                    .toPromise();
    }

    sendMessage(params): Promise<any> {
      const url = this.configurationService.getBaseUrl() + '/v1/messages';
        return this.http.post(url,
            {
                data: {
                    attributes: params,
                    type: 'messages'
                },
            })
            .toPromise();
    }
}
