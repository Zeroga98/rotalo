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

    acceptOffer(id: number){
        this.sendResponseOffer(id, 'accept');
    }

    declineOffer(id: number){
        this.sendResponseOffer(id, 'decline');
    }

    regretOffer(id: number){
        this.sendResponseOffer(id,'regret');
    }

    private sendResponseOffer(id: number, action:string){
        const url = `${this.url}/${id}/${action}`;
        return this.httpClient.post(url,{
            data: {
                id,
                type: 'offers'
            }
        }).toPromise();
    }

    private buildParams(params): any {
        return {
            data: {
                attributes: params,
                type: 'offers'
            }
        };
    }

}
