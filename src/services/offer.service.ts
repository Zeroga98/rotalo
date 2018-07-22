import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class OfferService {
    private readonly url = this.configurationService.getBaseSapiUrl() + '/ofertas';
    constructor(private httpClient: HttpClient, private configurationService: ConfigurationService) { }

    sendOffer(params): Promise<any> {
        return this.httpClient.post(this.url, params).toPromise();
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
        const url = `${this.url}/${id}/${action}`;
        return this.httpClient.put(url, params).toPromise();
    }

}
