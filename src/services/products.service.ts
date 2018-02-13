import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductsService {

    constructor(private http: HttpClient) { }

    getProducts(params): Promise<any>{
        const url = "https://api.staging.rotalo.co/v1/products";
        return this.http.get(url, {
            params:params
        }).toPromise();
    }
}