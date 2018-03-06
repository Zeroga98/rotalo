import { NotificationsInterface } from './../commons/interfaces/notifications.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class NotificationsService {
    notifications: NotificationsInterface[];

    constructor(private httpClient: HttpClient) { }

    getUnreadNotifications(): Promise<any> {
        const url: string = "https://api.staging.rotalo.co/v1/users/unread_notifications";

        return this.httpClient.get(url)
            .toPromise()
            .then((res: any) => res.data);
    }

    async getNotifications(): Promise<NotificationsInterface[]> {
        if (!this.notifications) {
            this.notifications = await this.getNotificationsFromServer();
        }
        return this.notifications;
    }

    private getNotificationsFromServer(): Promise<any> {
        const url = "https://api.staging.rotalo.co/v1/notifications"
        return this.httpClient
            .get(url)
            .map((response: any) => {
                let data = [].concat(response.data);
                return data.map( (notificacion:NotificationsInterface) => {
                    notificacion.status = this.updateStatusNotification(notificacion);
                    return notificacion;
                });
            })
            .toPromise();
    }

    private updateStatusNotification(notification) {
        let status;
        switch (notification['notification-type']) {
            case 'offer_accepted':
            case 'new_offer':
                if (notification.offer) {
                    status = notification.offer.accepted ? 'Oferta aceptada' : 'Oferta rechazada';
                }
            break;
            case 'new_purchase':
                status = this.getStatusNewPurchase(notification.purchase, notification.product);
            break;
            case 'rate_seller':
            case 'rate_buyer':
                if (notification.purchase && notification.purchase['seller-rate']) {
                    status = 'Evaluación enviada';
                }
            break;
            case 'purchase_accepted':
                if (notification.product && notification.product.received) status = 'Has recibido el producto';
            break;
        }
        return status;
    }

    private getStatusNewPurchase(purchase, product): string {
        if (purchase) {
            if (purchase.verified) {
                if (product['sell-type'] === 'GRATIS') {
                    return 'Lo has regalado';
                } else {
                    return 'Compra confirmada';
                }
            }
            else {
                if (product['sell-type'] === 'GRATIS') {
                    return 'No lo has regalado';
                } else {
                    return 'Compra rechazada';
                }
            }
        }
        return '';
    }
}