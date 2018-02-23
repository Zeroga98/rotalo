import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ActivationService {
    readonly url: string = "https://api.staging.rotalo.co/v1/users/activate"
    
    constructor(private httpClient:HttpClient) { }

    ejecuteActivation(code:string): Promise<any> {
        return this.httpClient.post(this.url,
                {
                    data:{
                        attributes:{
                            code: code
                        },
                        type:'users'
                    }
                }).toPromise();
    }
}