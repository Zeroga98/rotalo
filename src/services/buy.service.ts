import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BuyService {
    private readonly url = "https://api.staging.rotalo.co/v1/purchases"
    constructor(private httpClient: HttpClient) { }

    buyProduct(params): Promise<any>{
        return this.httpClient.post(this.url, this.buildParams(params)).toPromise();
    }

    private buildParams(params){
        return {
            data: {
                attributes:params,
                type: 'purchases'
            }
        }
    }

}