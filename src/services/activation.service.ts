import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';

@Injectable()
export class ActivationService {

    //readonly url = this.configurationService.getBaseUrl() + '/users/activate';

    constructor(private httpClient: HttpClient, private configurationService: ConfigurationService) { }

    /*ejecuteActivation(code: string): Promise<any> {
        return this.httpClient.post(this.url,
                {
                    data: {
                        attributes: {
                            code: code
                        },
                        type: 'users'
                    }
                }).toPromise().then( (response: any) => response.data);
    }*/

    activateCount(activationCode): Promise<any> {
      const jsonApiSapiHeaders = this.configurationService.getJsonSapiHeaders();
      const url =  this.configurationService.getBaseSapiUrl() + '/sapi/v1/auth/activar-usuario' ;
      const headers = new HttpHeaders(jsonApiSapiHeaders);
      return this.httpClient.post(url, activationCode, { headers: headers }).toPromise();
    }
}
