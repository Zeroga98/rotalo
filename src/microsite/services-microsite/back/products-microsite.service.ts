import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "../../../services/configuration.service";
import 'rxjs/add/operator/mergeMap';
import { UserService } from './../../../services/user.service';
import { ProductInterface } from "../../commons-microsite/interfaces/product.interface";
import { Router } from "@angular/router";

import { URLS } from '../../commons-microsite/constants/url-services';
import { ConfigurationMicrositeService } from '../configuration/configuration-microsite.service';

@Injectable()
export class ProductsMicrositeService {
  readonly url = this.configurationService.getBaseUrl() + '/productos/productos-tienda';
  readonly urlSapi = this.configurationService.getBaseSapiUrl();
  public scroll: any;
  public products: Array<ProductInterface> = [];
  public currentPage = 0;
  private urlDetailProduct;
  private totalProducts = 0;
  private featuredProducts;
  
  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
    private userService: UserService,
    private router: Router,
    ) { }

  setTotalProducts(total) {
    this.totalProducts = total;
  }

  getTotalProducts() {
    return this.totalProducts;
  }

  setUrlDetailProduct(urlDetailProduct) {
    this.urlDetailProduct = urlDetailProduct;
  }

  getUrlDetailProduct() {
    return this.urlDetailProduct;
  }

  getProductsSuper(idUser, params) {
    let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    jsonSapiHeaders = Object.assign(jsonSapiHeaders, { userid: idUser });
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = this.urlSapi + '/productos/productos-tienda';
    return this.http.get(url, { headers: headers, params: params }).toPromise()
      .then((response: any) => {
        if (response.body.totalProductos) {
          this.setTotalProducts(response.body.totalProductos);
        }
        return response.body.productos;
      });
  }

  getProductsMicrosite(idUser, params): Promise<any> {
    let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    jsonSapiHeaders = Object.assign(jsonSapiHeaders, { userid: idUser, codTienda: '1' });
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = this.urlSapi + '/productos/productos-tienda';
    return this.http.get(url, { headers: headers, params: params }).toPromise()
      .then((response: any) => {
        if (response.body.totalProductos) {
          this.setTotalProducts(response.body.totalProductos);
        }
        return response.body.productos;
      });
  }

  addProductToBD(body, params): Promise<any> {
    let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = this.urlSapi + '/carritos/productos';
    return this.http.post(url, body, { headers: headers, params: params }).toPromise()
      .then((response: any) => {
        return response.body.productos;
      }); 
  }

  deleteProductToBD(body, params): Promise<any> {
    let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = this.urlSapi + '/carritos/productos/eliminar';
    console.log(body);
    return this.http.post(url, body, { headers: headers, params: params }).toPromise()
      .then((response: any) => {
        return response;
      }); 
  }

  getCarProducts(params): Promise<any> {
    let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = this.urlSapi + '/carritos';
    return this.http.get(url, { headers: headers, params: params }).toPromise()
      .then((response: any) => {
        return response.body;
      });
  }

  getProductsById(id: number): Promise<any> {
    const url = `${this.url}/${id}`;
    return this.http
      .get(url)
      .toPromise()
      .then((response: any) => response.data);
  }

  getProductsByIdDetail(id: number) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/${id}`;
    return this.http.get(url, { headers: headers }).map((response: any) => response);
  }

  deleteProduct(id: number | string): Promise<any> {
    const url = `${this.url}/${id}`;
    return this.http
      .delete(url)
      .toPromise()
      .then((response: any) => {
        this.userService.updateInfoUser();
      });
  }

  receiveProduct(id: number, data): Promise<any> {
    const url = `${this.url}/deliver`;
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
    return this.http
      .put(url, request)
      .toPromise()
      .then((response: any) => response.data);
  }

  updateProductForm(id: number | string, params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/${id}`;
    return this.http.put(url, params, { headers: headers }).map((response: any) => response);
  }

  updateProductStatus(idUser, id: number | string, params): Promise<any> {
    let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    jsonSapiHeaders = Object.assign(jsonSapiHeaders, { userId: idUser });
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/${id}/estados`;
    return this.http
      .put(url, params, { headers: headers })
      .toPromise()
      .then((response: any) => response);
  }

  saveProducts(params): Promise<any> {
    return this.http.post(this.url, this._buildParams(params)).toPromise();
  }

  saveProductsForm(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = this.urlSapi + '/productos';
    return this.http.post(url, params, { headers: headers }).map((response: any) => response);
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

  visitorCounter(productId) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/${productId}/visitas`;
    return this.http.put(url, { headers: headers }).map((response: any) => response);
  }

  shareProduct(params, productId) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/${productId}/referidos`;
    return this.http.post(url, params, { headers: headers }).toPromise().then((response: any) => response);
  }

  shareCoupon(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/convenios/referidos`;
    return this.http.post(url, params, { headers: headers }).toPromise().then((response: any) => response);
  }

  sendTokenShareProduct(token) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/referidos/${token}`;
    return this.http.put(url, { headers: headers }).map((response: any) => response);
  }

  initProducts() {
    this.products = [];
  }

  setProductLocation(products, name, currentPage) {
    this.scroll = name;
    this.products = products;
    this.currentPage = currentPage;
  }

  setProducts(products) {
    this.products = products;
  }

  getProductLocation() {
    if (document && this.scroll) {
      if (document.getElementById(this.scroll)) {
        document.getElementById(this.scroll).scrollIntoView(true);
        this.scroll = undefined;
      }
    }
  }
}
