
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/mergeMap';
import { UserInterface } from '../commons/interfaces/user.interface';
import { ConfigurationService } from '../services/configuration.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
@Injectable()
export class MessagesService {
    currentUser: UserInterface;
    readonly url = this.configurationService.getBaseUrl() + '/conversations';
    readonly urlSapi = this.configurationService.getBaseSapiUrl();
    private readonly timeToCheckNotification: number = 10000;
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

    getMessagesUnred(idUser): Observable<any> {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi, {userid: idUser} );
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/notificaciones-sin-leer';

      return Observable.timer(0, this.timeToCheckNotification)
      .concatMap(() =>  this.http.get(url, { headers: headers }))
      .map((response: any) => response);

    /*  return this.http
        .get(url, { headers: headers })
        .map((response: any) => response);*/
    }

    getMessages(idUser): Observable<any> {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi, {userId: idUser} );
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/notificaciones';
      return Observable.timer(0, this.timeToCheckNotification)
      .concatMap(() =>  this.http.get(url, { headers: headers }))
      .map((response: any) => {
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
      } );
    /*  return this.http
        .get(url, { headers: headers })
        .map((response: any) => {
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
        } );*/
    }

    updateSellUnknow(params){
      const headersSapi = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/ventas-desconocidas';
      return this.http
      .put(url, params , { headers: headers })
      .map((response: any) => response);
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
              if (notification.producto && notification.producto.recibido) {
                switch (notification.producto.recibido) {
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
        .get(url, { headers: headers })
        .map((response: any) => response);
    }

    sendMessage(params, idUser) {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi, {userid: idUser} );
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/mensajes';
      return this.http
        .post(url, params ,{ headers: headers })
        .map((response: any) => response);
    }

    checkNotificationHobbies(idUser) {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi, {userid: idUser} );
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/notificaciones-intereses';
      return this.http
        .post(url , { headers: headers })
        .map((response: any) => response);
    }

    updateMessage(params, idUser) {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi, {userid: idUser} );
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/notificaciones';
      return this.http
        .put(url, params , { headers: headers })
        .map((response: any) => response);
    }

    deleteMessage(idConversation, idUser) {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi, {userid: idUser} );
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/conversaciones/' + idConversation;
      return this.http .delete (url , { headers: headers })
        .map((response: any) => response);
    }

    rateSeller(params, idUser) {
      let headersSapi = this.configurationService.getJsonSapiHeaders();
      headersSapi = Object.assign(headersSapi, {userid: idUser} );
      const headers = new HttpHeaders(headersSapi);
      const url = this.urlSapi + '/centro/rotalo/calificaciones';
      return this.http
        .put(url, params , { headers: headers })
        .map((response: any) => response);
    }

}
