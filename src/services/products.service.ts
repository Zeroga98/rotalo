import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from "../services/configuration.service";
import 'rxjs/add/operator/mergeMap';
import { UserService } from './user.service';
import { ProductInterface } from '../commons/interfaces/product.interface';

@Injectable()
export class ProductsService {
    readonly url = this.configurationService.getBaseUrl() + '/products';

    readonly urlSapi = this.configurationService.getBaseSapiUrl();
    public scroll: any;
    public products: Array<ProductInterface> = [];

    constructor(private http: HttpClient,
        private configurationService: ConfigurationService,
        private userService: UserService) { }

    getProducts(params): Promise<any> {
        return this.http.get(this.url, { params: params })
            .toPromise()
            .then((response: any) => {
                response.data.lastPage = response.links.next === undefined;
                return response.data;
            });
    }

    getProductsById(id: number): Promise<any> {
        const url = `${this.url}/${id}`;
        return this.http.get(url).toPromise().then((response: any) => response.data);
    }

    deleteProduct(id: number | string): Promise<any> {
        const url = `${this.url}/${id}`;
        return this.http.delete(url).toPromise().then((response: any) => {
            this.userService.updateInfoUser();
        });
    }

    receiveProduct(id: number, data): Promise<any> {
        const url = `${this.url}/${id}/deliver`;
        const params = {
            data: {
                id,
                type: 'products'
            }
        };
        return this.http.post(url, params).toPromise();
    }

    updateProduct(id: number | string, params): Promise<any> {
        const url = `${this.url}/${id}`;
        const request = this._buildParams(params);
        request.data.id = `${id}`;
        return this.http.put(url, request).toPromise().then((response: any) => response.data);
    }

    saveProducts(params): Promise<any> {
        return this.http.post(this.url, this._buildParams(params)).toPromise();
    }

    private _buildParams(params): any {
        return {
            data: {
                attributes: params,
                type: 'products'
            },
        };
    }

    republishService(params) {
        const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
        const headers = new HttpHeaders(jsonSapiHeaders);
        const url = this.urlSapi + '/centro/rotalo/republicaciones';
        return this.http.put(url, params, { headers: headers });
    }

    republishNewProduct(params) {
        const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
        const headers = new HttpHeaders(jsonSapiHeaders);
        const url = this.urlSapi + '/centro/rotalo/productos';
        return this.http.post(url, params, { headers: headers }).map((response: any) => response);
    }

    getInfoAdditional(idUser) {
        let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
        jsonSapiHeaders = Object.assign(jsonSapiHeaders, { userid: idUser });
        const headers = new HttpHeaders(jsonSapiHeaders);
        const url = this.urlSapi + '/centro/rotalo/vendidos-comprados';
        return this.http.get(url, { headers: headers }).map((response: any) => response);
    }

    shareProduct(params) {
      const url = this.url + '/refer';
      return this.http.post(url, params).toPromise().then( (response: any) => response);
    }

    setProductLocation(products, name) {
        this.scroll = name;
        this.products = products;
    }

    getProductLocation(){
      if (document && this.scroll) { document.getElementById(this.scroll).scrollIntoView();}
    }
}
