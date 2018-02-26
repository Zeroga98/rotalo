import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from "../services/configuration.service";
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class ProductsService {
    readonly url = this.configurationService.getBaseUrl() + '/v1/products';

    constructor(private http: HttpClient, private configurationService: ConfigurationService) { }

    getProducts(params): Promise<any>{
        return this.http.get(this.url, {params: params})
                    .toPromise()
                    .then( (response: any) => response.data);
    }

    getProductsById(id:number):Promise<any> {
        const url = `${this.url}/${id}`;
        return this.http.get(url).toPromise().then( (response: any) => response.data);
    }

    deleteProduct(id:number | string ):Promise<any>{
        const url = `${this.url}/${id}`;
        return this.http.delete(url).toPromise().then( (response: any) => response.data);
    }

    saveProducts(params):Promise<any>{
        return this.http.post(this.url,
                    {
                        data:{
                            attributes: params,
                            type: 'products'
                        },
                    },
                    {
                        headers: { 'Content-Type': 'application/vnd.api+json'}
                    })
                    .toPromise();
    }
}
