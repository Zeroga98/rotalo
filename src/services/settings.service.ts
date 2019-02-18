
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

  createCampaign(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/campaigns`;
    return this.http.post(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  updateCampaign(params, id) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/campaigns/${id}`;
    return this.http.put(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  loadCampaign(id) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/campaigns/${id}`;
    return this.http.get(url , { headers: headers }).pipe(map((response: any) => response));
  }

  getCampaignsList() {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/campaigns`;
    return this.http.get(url , { headers: headers }).pipe(map((response: any) => response));
  }

  changeStateCampaign(idCampaign, params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/campaigns/states/${idCampaign}`;
    return this.http.put(url , params, { headers: headers }).pipe(map((response: any) => response));
  }

  deleteCampaign(idCampaign) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/campaigns/${idCampaign}`;
    return this.http.delete(url , { headers: headers }).pipe(map((response: any) => response));
  }

  getBannersList() {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/banners`;
    return this.http.get(url , { headers: headers }).pipe(map((response: any) => response));
  }

  getCommunitiesCampaign(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/banners/comunidades`;
    return this.http.post(url , params, { headers: headers }).pipe(map((response: any) => response));
  }


}
