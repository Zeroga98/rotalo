import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class RatingService {
    private readonly _url: string = this.configurationService.getBaseUrl() + '/v1/rates';
    
    constructor(private httpClient: HttpClient,private configurationService: ConfigurationService) { }

    rate(rate: number, comment: string, id: number):Promise<any>{
        const params = this._buildParams(rate, comment, id);
        return this.httpClient.post(this._url, params).toPromise();
    }

    private _buildParams(rate: number, comment: string, id: number){
        return {
            data: {
                attributes:{
                    value: rate,
                    comment: comment,
                    'purchase-id': id
                },
                type: 'rates'
            }
        }
    }

}