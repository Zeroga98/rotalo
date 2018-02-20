import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class ProductsService {

    constructor(private http: HttpClient) { }

    getProducts(params): Observable<any>{
        console.log("load products");
        const url = 'https://api.staging.rotalo.co/v1/products';
        return this.http.get(url, {params: params})
                    .flatMap( (response: any) => response.data);
    }
}
