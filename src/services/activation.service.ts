import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';

@Injectable()
export class ActivationService {

    readonly url = this.configurationService.getBaseUrl() + '/v1/users/activate';

    constructor(private httpClient: HttpClient, private configurationService: ConfigurationService) { }

    ejecuteActivation(code:string): Promise<any> {
        return this.httpClient.post(this.url,
                {
                    data: {
                        attributes: {
                            code: code
                        },
                        type: 'users'
                    }
                }).toPromise().then( (response: any) => response.data);
    }
}
