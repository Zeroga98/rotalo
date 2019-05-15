
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../services/configuration.service';

@Injectable()
export class ChangePasswordService {
readonly urlSapi = this.configurationService.getBaseSapiUrl();

constructor(private http: HttpClient,
  private configurationService: ConfigurationService) { }

  changePass(currentUser): Promise<any> {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const url = `${this.urlSapi}/perfil/password`;
    const headers = new HttpHeaders(jsonSapiHeaders);
    return this.http.put(url, currentUser, { headers: headers }).toPromise();
  }

  changePassProfile (params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/registro/restablecer`;
    return this.http.post(url, params, { headers: headers }).pipe(map((response: any) => response));
  }


}
