import { NotificationsInterface } from './../commons/interfaces/notifications.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class NotificationsService {
    notifications: NotificationsInterface[];

    constructor(private httpClient: HttpClient, private configurationService: ConfigurationService) { }

    /*getUnreadNotifications(): Promise<any> {
        const url: string = this.configurationService.getBaseUrl() + '/users/unread_notifications';
        return this.httpClient.get(url)
            .toPromise()
            .then((res: any) => res.data);
    }*/

    async getNotifications(): Promise<NotificationsInterface[]> {
        this.notifications = await this.getNotificationsFromServer();
        return this.notifications;
    }

    private getNotificationsFromServer(): Promise<any> {
        const url: string = this.configurationService.getBaseUrl() + '/notifications';
        return this.httpClient
            .get(url)
            .map((response: any) => {
                const data = [].concat(response.data);
                return data.map( (notificacion: NotificationsInterface) => {
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
                if (notification.offer) {
                  switch (notification.offer.regretted) {
                    case true:
                      status = 'Compra no realizada';
                      break;
                    case false:
                      status = 'Compra realizada';
                      break;
                  }
                }
            break;
            case 'new_offer':
                if (notification.offer) {
                  switch (notification.offer.accepted) {
                    case true:
                      status = 'Oferta aceptada';
                      break;
                    case false:
                      status = 'Oferta rechazada';
                      break;
                  }
                }
            break;
            case 'new_purchase':
                status = this.getStatusNewPurchase(notification.purchase, notification.product);
            break;
            case 'rate_seller':
            case 'rate_buyer':
                if (notification.purchase && (notification.purchase['seller-rate'] || notification.purchase['buyer-rate'])) {
                    status = 'Evaluación enviada';
                }
            break;
            case 'purchase_accepted':
                if (notification.product) {
                  switch (notification.product.received) {
                    case true:
                      status =  'Has recibido el producto';
                      break;
                  }
                }
            break;
        }
        return status;
    }

    private getStatusNewPurchase(purchase, product): string {
      let result;
      if (purchase) {
        switch (purchase.verified) {
          case true:
            if (product['sell-type'] === 'GRATIS') {
              result = 'Lo has regalado';
            } else {
              result = 'Compra confirmada';
            }
            return result;
          case false:
            if (product['sell-type'] === 'GRATIS') {
              result = 'No lo has regalado';
            } else {
              return 'Compra rechazada';
            }
            return result;
        }
      }
    }
}
