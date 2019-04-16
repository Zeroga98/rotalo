
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../services/configuration.service';

@Injectable()
export class RecoverService {
readonly urlSapi = this.configurationService.getBaseSapiUrl();
//readonly url = this.configurationService.getBaseUrl();
constructor(private http: HttpClient,
  private configurationService: ConfigurationService) { }


  /*
  recoverUser(user): Promise<any> {
    const jsonApiHeaders = this.configurationService.getJsonApiHeaders();
    const url =  this.configurationService. getBaseUrl() + '/passwords/recover';
    const headers = new HttpHeaders(jsonApiHeaders);
    return this.http.post(url, user, { headers: headers }).toPromise();
  }
*/

  recoverUser (params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/registro/recuperar`;
    return this.http.post(url, params, { headers: headers }).pipe(map((response: any) => response));
  }


}
