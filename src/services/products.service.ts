import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class ProductsService {
    readonly url = "https://api.staging.rotalo.co/v1/products";
    
    constructor(private http: HttpClient) { }

    getProducts(params): Promise<any>{
        console.log("load products");
        return this.http.get(this.url, {params:params})
                    .toPromise()
                    .then( (response:any) => response.data);
    }

    getProductsById(id:number):Promise<any>{
        const url = `${this.url}/${id}`;
        return this.http.get(url).toPromise().then( (response:any) => response.data);
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