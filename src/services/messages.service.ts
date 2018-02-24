import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/mergeMap';
import { UserInterface } from '../commons/interfaces/user.interface';

@Injectable()
export class MessagesService {
    currentUser: UserInterface;
    readonly url = "https://api.staging.rotalo.co/v1/conversations";

    constructor(private http: HttpClient) { }

    getConversation(): Promise<any> {

        const url = `${this.url}`;
        return this.http.get(url).toPromise().then((response: any) => response.data);

    }

    getConversationByID(id: string): Promise<any> {
        const url = `${this.url}/${id}`;
        return this.http.get(url).toPromise().then((response: any) => response.data);
    }
}