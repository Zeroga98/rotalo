import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInterface } from '../commons/interfaces/user.interface';
import { ConfigurationService } from '../services/configuration.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/concatMap';
import {map} from 'rxjs/operators';
import { RequestOptions } from '@angular/http';


@Injectable()
export class MessagesService {
    currentUser: UserInterface;
    readonly url = this.configurationService.getBaseUrl() + '/conversations';
    readonly urlSapi = this.configurationService.getBaseSapiUrl();
    private readonly timeToCheckNotification: number = 4000;
    private readonly timeToCheckUnreadNotification: number = 70000;
    private path = {
      'rutaRenoEscondido':  ''
    };
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
        return this.http.get(this.url).pipe(
                    map( (conversations: any) => conversations.data),
                    map( (conversations: any) => {
                        conversations = [].concat(conversations);
                        return conversations.filter( (conversation: any) => conversation['unread-count'] > 0);
                    }))
                    .toPromise();
    }

    setUnreadNotificationParam(path) {
      this.path = path;
    }

    getUnreadNotificationParam() {
      return this.path;
    }

    getMessagesUnred(idUser): Observable<any> {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi, {userid: idUser} );
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/notificaciones-sin-leer';

      return Observable.timer(0, this.timeToCheckUnreadNotification)
      .concatMap(() =>  this.http.put(url, this.getUnreadNotificationParam() , { headers: headers }))
      .pipe(map((response: any) => response));
    }

    getMessages(): Observable<any> {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi);
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/notificaciones/mensajes';
      return Observable.timer(0, this.timeToCheckNotification)
      .concatMap(() =>  this.http.get(url, { headers: headers }))
      .pipe(map((response: any) => {
        if (response.body.emisarios) {
          response.body.emisarios.map((emisario) => {
            emisario.mensajes.map((mensaje) => {
            mensaje.status = this.updateStatusNotification(mensaje);
            const dateMoment: any = moment(mensaje.fechaHora);
            mensaje.fechaHora = dateMoment.format('MMMM Do YYYY, h:mm:ss a');
            });
          });
        }
        return response;
      } ));
    }

    getNotifications(filter): Observable<any> {
      const headersSapi = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(headersSapi);
      const url = `${this.urlSapi}/centro/rotalo/notificaciones?size=${filter.size}&number=${filter.number}`;
      return  this.http.get(url, { headers: headers })
      .pipe(map((response: any) => {
        if (response.body.notificaciones) {
          response.body.notificaciones.map((notification) => {
            notification.status = this.updateStatusNotification(notification);
            /* const dateMoment: any = moment(notification.fechaHora);
            notification.fechaHora = dateMoment.format('MMMM Do YYYY, h:mm:ss a'); */
            });
        }
        return response;
      } ));
    }

    updateNotification(params) {
      const headersSapi = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/notificaciones';
      return this.http
      .put(url, params , { headers: headers }).pipe(
      map((response: any) => response));
    }

    deleteNotification(params) {
      const headersSapi = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/notificaciones/eliminar';
      return this.http
      .put(url, params , { headers: headers }).pipe(
      map((response: any) => response));
    }

    updateSellUnknow(params){
      const headersSapi = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/ventas-desconocidas';
      return this.http
      .put(url, params , { headers: headers }).pipe(
      map((response: any) => response));
    }


    private updateStatusNotification(notification) {
      let status;
      switch (notification['tipoNotificacion']) {
          case 'offer_accepted':
              if (notification.oferta) {
                switch (notification.oferta.arrepentido) {
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
              if (notification.oferta) {
                switch (notification.oferta.aceptado) {
                  case true:
                    status = 'Oferta aceptada';
                    break;
                  case false:
                    status = 'Oferta rechazada';
                    break;
                }
              }
          break;
          case 'auction_assigned':
          if (notification.compra) {
            status = 'Oferta aceptada';
          }
          if (notification.oferta) {
            switch (notification.oferta.arrepentido) {
              case false:
                status = 'Oferta aceptada';
                break;
              case true:
                status = 'Oferta rechazada';
                break;
            }
          }
          break;
          case 'new_purchase':
              status = this.getStatusNewPurchase(notification.compra, notification.producto);
          break;
          case 'rate_seller':
          case 'rate_buyer':
              if (notification.compra && (notification.compra.sellerRate || notification.compra.buyerRate)) {
                  status = 'Evaluación enviada';
              }
          break;
          case 'purchase_accepted':

              if (notification.checkRecibido) {
                switch (notification.checkRecibido == 'check_received') {
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

    if (purchase && purchase.verificado) {
      switch (purchase.verificado) {
        case true:
          if (product.tipoVenta === 'GRATIS') {
            result = 'Lo has regalado';
          } else {
            result = 'Compra confirmada';
          }
          return result;
        case false:
          if (product.tipoVenta === 'GRATIS') {
            result = 'No lo has regalado';
          } else {
            return 'Compra rechazada';
          }
          return result;
      }
    }
  }

    getConversationMessages(idUser, idUserEmit) {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi, {userid: idUser} );
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/notificaciones/' + idUserEmit;
      return this.http
        .get(url, { headers: headers }).pipe(
        map((response: any) => response));
    }

    sendMessage(params) {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi);
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/mensajes';
      return this.http
        .post(url, params , { headers: headers }).pipe(
        map((response: any) => response));
    }

    checkNotificationHobbies(idUser) {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi, {userid: idUser} );
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/notificaciones-intereses';
      return this.http
        .post(url , { headers: headers }).pipe(
        map((response: any) => response));
    }

    updateMessage(params) {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi);
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/notificaciones/chat';
      return this.http
        .put(url, params , { headers: headers }).pipe(
        map((response: any) => response));
    }

    deleteMessage(params) {
      const headersSapi = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/mensajes';
      return this.http.put (url , params , { headers: headers }).pipe(
        map((response: any) => response));
    }

    rateSeller(params, idUser) {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi, {userid: idUser} );
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/calificaciones';
      return this.http
        .put(url, params , { headers: headers }).pipe(
        map((response: any) => response));
    }

    notificationConfirmation(params) {
      const headersSapi = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/general/envios-correos';
      return this.http
        .put(url, params , { headers: headers }).pipe(
        map((response: any) => response));
    }

}
