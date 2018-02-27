import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationsInterface } from '../commons/interfaces/notifications.interface';

@Injectable()
export class NotificationsService {
    notifications:NotificationsInterface;

    constructor(private httpClient:HttpClient) { }

    async getNotifications():Promise<NotificationsInterface>{
        if(!this.notifications){
            this.notifications = await this.getNotificationsFromServer();
        }
        return this.notifications;
    }

    private getNotificationsFromServer():Promise<any>{
        const url = "https://api.staging.rotalo.co/v1/notifications"
        return this.httpClient
                    .get(url)
                    .map( (response:any) => response.data)
                    .toPromise();
    }

}