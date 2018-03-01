import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class NotificationsService {
    
    constructor(private http: HttpClient) { }

    getUnreadNotifications(): Promise<any>{
        const url: string = "https://api.staging.rotalo.co/v1/users/unread_notifications";  
        
        return this.http.get(url)
                        .toPromise()
                        .then( (res:any) => res.data);
    }
}