
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/mergeMap';
import { UserInterface } from '../commons/interfaces/user.interface';
import { ConfigurationService } from '../services/configuration.service';

@Injectable()
export class MessagesService {
    currentUser: UserInterface;
    readonly url = this.configurationService.getBaseUrl() + '/conversations';
    readonly urlSapi = this.configurationService.getBaseSapiUrl();

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }

    getConversation(): Promise<any> {
        const url = `${this.url}`;
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

    getMessagesUnred(idUser) {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi, {userid: idUser} );
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/notificaciones-sin-leer';
      return this.http
        .get(url, { headers: headers })
        .map((response: any) => response);
    }

    getMessages(idUser) {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi, {userid: idUser} );
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/mensajes';
      return this.http
        .get(url, { headers: headers })
        .map((response: any) => response);
    }

    getConversationMessages(idUser, idUserEmit) {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi, {userid: idUser} );
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/mensajes/' + idUserEmit;
      return this.http
        .get(url, { headers: headers })
        .map((response: any) => response);
    }

    sendMessage(params): Promise<any> {
      const url = this.configurationService.getBaseUrl() + '/messages';
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
