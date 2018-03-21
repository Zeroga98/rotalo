import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class OfferService {
    private readonly url = this.configurationService.getBaseUrl() + '/v1/offers';
    constructor(private httpClient: HttpClient, private configurationService: ConfigurationService) { }

    sendOffer(params): Promise<any> {
        return this.httpClient.post(this.url, this.buildParams(params)).toPromise();
    }

    private buildParams(params) {
        return {
            data: {
                attributes: params,
                type: 'offers'
            }
        };
    }

}
