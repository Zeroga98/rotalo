import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class OfferService {
    private readonly url = "https://api.staging.rotalo.co/v1/offers"
    
    constructor(private httpClient: HttpClient) { }

    sendOffer(params): Promise<any>{
        return this.httpClient.post(this.url, this.buildParams(params)).toPromise();
    }

    private buildParams(params){
        return {
            data: {
                attributes:params,
                type: 'offers'
            }
        }
    }

}