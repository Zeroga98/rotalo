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
    const url = `${this.urlSapi}/admin/ordenes/estados`;
    return this.http.get(url, { headers: headers }).map((response: any) => response);
  }

  getOrders(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/admin/ordenes`;
    return this.http.get(url, { headers: headers, params }).map((response: any) => response);
  }

}
