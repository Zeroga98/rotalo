import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { CurrentSessionService } from './current-session.service';

@Injectable()
export class OfferService {

   private userId = this.currentSessionService.getIdUser();
    private readonly url = this.configurationService.getTempBaseUrl() + '/ofertas';
    constructor(private httpClient: HttpClient, private configurationService: ConfigurationService,
      private currentSessionService: CurrentSessionService) { }

  sendOffer(params): Promise<any> {
    let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    jsonSapiHeaders = Object.assign(jsonSapiHeaders, { userid: this.userId });
    const headers = new HttpHeaders(jsonSapiHeaders);
    return this.httpClient.post(this.url, params, { headers: headers }).toPromise();
  }

    acceptOffer(id: number , params) {
        this.sendResponseOffer(id, 'aceptar', params);
    }

    declineOffer(id: number, params) {
        this.sendResponseOffer(id, 'rechazar', params);
    }

    regretOffer(id: number, params) {
        this.sendResponseOffer(id, 'arrepentir', params);
    }

    private sendResponseOffer(id: number, action: string, params) {
      let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
      jsonSapiHeaders = Object.assign(jsonSapiHeaders, { userid: this.userId });
      const headers = new HttpHeaders(jsonSapiHeaders);
        const url = `${this.url}/${id}/${action}`;
        return this.httpClient.put(url, params, { headers: headers }).toPromise();
    }

}
