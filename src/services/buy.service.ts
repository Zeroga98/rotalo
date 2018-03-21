import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class BuyService {
    private readonly url = this.configurationService.getBaseUrl() + '/v1/purchases';
    constructor(private httpClient: HttpClient, private configurationService: ConfigurationService) { }

    buyProduct(params): Promise<any>{
        return this.httpClient.post(this.url, this.buildParams(params)).toPromise();
    }

    private buildParams(params){
        return {
            data: {
                attributes: params,
                type: 'purchases'
            }
        }
    }

}
