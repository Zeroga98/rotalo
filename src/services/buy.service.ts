
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';


@Injectable()
export class BuyService {
  private readonly url = this.configurationService.getBaseUrl() + '/purchases';
  private readonly urlNewPurchase = this.configurationService.getBaseUrl() + '/purchases/create_and_confirm';
  private readonly urlNequi = this.configurationService.getBaseSapiUrl() + '/pagos/nequi/notificaciones';
  private readonly urlSapi = this.configurationService.getBaseSapiUrl();
  private quantityProduct;
  constructor(
    private httpClient: HttpClient,
    private configurationService: ConfigurationService
  ) {}

  buyProduct(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/compras`;
    return this.httpClient.post(url, params, { headers: headers}).pipe(map( (response: any) => response));
  }

  buyProductNequi(params) {
    const jsonNequiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonNequiHeaders);
    return this.httpClient.post(this.urlNequi, params, { headers: headers}).pipe(map( (response: any) =>
      response
    ));
  }

  rentProduct (idProducto) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url =
    `${this.urlSapi}/productos/me-interesa/${idProducto}`;
    const params = {};
    return this.httpClient.post(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  validateStateNequi(params) {
    const url = this.configurationService.getBaseSapiUrl() +
    `/pagos/nequi/estado-pago-reactivo?` +
    `numeroCelular=${params.numeroCelular}&idTransaccion=${params.idTransaccion}&idProducto=${params.idProducto}`;
    const jsonNequiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonNequiHeaders);
    return this.httpClient.get(url, { headers: headers}).pipe(map( (response: any) =>
      response
    ));
  }

  changeStatusProduct(params) {
    const url = this.configurationService.getBaseSapiUrl() + '/pagos/nequi/estado-producto';
    const jsonNequiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonNequiHeaders);
    return this.httpClient.put(url, params, {headers: headers}).pipe(map( (response: any) =>
      response
    ));
  }

  confirmPurchase(id) {
    this.sendResponsePurchase(id, 'confirm');
  }

  declinePurchase(id) {
    this.sendResponsePurchase(id, 'decline');
  }

  private sendResponsePurchase(id: number, action: string) {
    const url = `${this.url}/${id}/${action}`;
    return this.httpClient.post(url, {
        data: {
          id,
          type: 'purchases'
        }
      })
      .toPromise();
  }

  private buildParams(params) {
    return {
      data: {
        attributes: params,
        type: 'purchases'
      }
    };
  }

  public getQuantityProduct() {
    return this.quantityProduct;
  }

  public setQuantityProduct(quantityProduct) {
    this.quantityProduct = quantityProduct;
  }

}
