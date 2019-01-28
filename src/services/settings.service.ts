
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class SettingsService {
  readonly url = this.configurationService.getBaseUrl() + '/settings';
  readonly urlSapi = this.configurationService.getBaseSapiUrl();
  constructor(private http: HttpClient, private configurationService: ConfigurationService) {}

  getSettings(): Promise<any> {
    return this.http.get(this.url).toPromise().then( (response: any) => response.data);
  }

  getTypeOrders() {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/ordenes/estados`;
    return this.http.get(url, { headers: headers }).pipe(map((response: any) => response));
  }

  getOrders(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/ordenes`;
    return this.http.post(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  getPreRegisters() {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/preregistro`;
    return this.http.get(url, { headers: headers }).pipe(map((response: any) => response));
  }

  changeStatusOrders(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/ordenes/actualizar`;
    return this.http.post(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  deleteProduct(id: number | string): Promise<any> {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/preregistro/${id}`;
    return this.http
      .delete(url, { headers: headers })
      .toPromise();
  }

}
