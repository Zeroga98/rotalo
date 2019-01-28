
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class HobbiesService {
  readonly urlSapi = this.configurationService.getBaseSapiUrl();
  constructor( private http: HttpClient,
    private configurationService: ConfigurationService) {}

  getHobbies(idUser) {
    let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    jsonSapiHeaders = Object.assign(jsonSapiHeaders, { userid: idUser });
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = this.urlSapi + '/perfil/intereses';
    return this.http
      .get(url, { headers: headers }).pipe(
      map((response: any) => response));
  }

  sendHobbies(params, idUser) {
    let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    jsonSapiHeaders = Object.assign(jsonSapiHeaders, { userid: idUser });
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = this.urlSapi + '/perfil/intereses';
    return this.http.post(url, params, { headers: headers }).pipe(map((response: any) => response));
}


}
