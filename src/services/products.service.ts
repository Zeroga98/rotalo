
import {map} from 'rxjs/operators';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "../services/configuration.service";

import { UserService } from './user.service';
import { ProductInterface } from '../commons/interfaces/product.interface';
import { Router } from "@angular/router";
import { ROUTES } from "../router/routes";

@Injectable()
export class ProductsService {
  //readonly url = this.configurationService.getBaseUrl() + '/products';
  readonly urlSapi = this.configurationService.getBaseSapiUrl();
  public scroll: any;
  public products: Array<ProductInterface> = [];
  public productsFilter: Array<ProductInterface> = [];
  public scrollFilter;
  public currentPageFilter;
  public currentPage = 0;
  private urlDetailProduct;
  private totalProducts = 0;
  private totalProductsFilters = 0;
  private featuredProducts;
  private bancolombiaProducts;
  private counterProductChecked = 0;
  private paramsProductChecked  = {'data': []};
  public filter = {};
  public currentFilter;
  public carObject;

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

  setTotalProductsFilters(total) {
    this.totalProductsFilters = total;
  }

  getTotalProductsFilters() {
    return this.totalProductsFilters;
  }

  setUrlDetailProduct(urlDetailProduct) {
    this.urlDetailProduct = urlDetailProduct;
  }

  getUrlDetailProduct() {
    return this.urlDetailProduct;
  }

  /*getProducts(params): Promise<any> {
    return this.http
      .get(this.url, { params: params })
      .toPromise()
      .then((response: any) => {
        if (response.meta) {
          this.setTotalProducts(response.meta['record-count']);
        }
        response.data.lastPage = response.links.next === undefined;
        return response.data;
      });
  }*/

  loadProducts(params): Promise<any> {
    const url = this.urlSapi + '/productos/feed?';
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    return this.http
      .get(url, { headers: headers, params: params})
      .toPromise()
      .then((response: any) => {
        if (response.body.totalProductos) {
          this.setTotalProducts(response.body.totalProductos);
        }
        return response.body.productos;
      });
  }

  loadProductsFilter(params): Promise<any> {
    const url = this.urlSapi + '/productos/filtros?';
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    return this.http
      .get(url, { headers: headers, params: params})
      .toPromise()
      .then((response: any) => {
        if (response.body.totalProductos) {
          this.setTotalProductsFilters(response.body.totalProductos);
        }
        return response.body;
      });
  }

  loadProductsRotandoVencidos(filter): Promise<any> {
    const request =  {
      opcion: filter.staged
    };
    const url = `${this.urlSapi}/productos/rotando-vencidos?size=${filter.size}&number=${filter.number}`;
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    return this.http
      .post(url, request, { headers: headers})
      .toPromise()
      .then((response: any) => {
        return response.body;
      });
  }

  loadProductsVendidosComprados(filter): Promise<any> {
    const request =  {
      opcion: filter.staged
    };
    const url = `${this.urlSapi}/productos/vendidos-comprados?size=${filter.size}&number=${filter.number}`;
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    return this.http
      .post(url, request, { headers: headers})
      .toPromise()
      .then((response: any) => {
        return response.body;
      });
  }

  loadFeaturedSelectedProducts() {
    const url = this.urlSapi + '/productos/destacados/manuales';
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    return this.http
      .get(url, { headers: headers})
      .toPromise()
      .then((response: any) => {
        return response.body.productos;
      });
  }

  selectFeaturedProduct(id: number, productSelect) {
    const params = {
      destacar: productSelect
    };
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/${id}/destacados`;
    return this.http.put(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  getProductsSuper(idUser, params) {
    let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    jsonSapiHeaders = Object.assign(jsonSapiHeaders, { userid: idUser });
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = this.urlSapi + '/productos';
    return this.http.get(url, { headers: headers, params: params }).toPromise()
      .then((response: any) => {
        if (response.body.totalProductos) {
          this.setTotalProducts(response.body.totalProductos);
        }
        return response.body.productos;
      });
  }

  getProductsPromo(idUser, params) {
    let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    jsonSapiHeaders = Object.assign(jsonSapiHeaders, { userid: idUser });
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = this.urlSapi + '/productos/rebajados';
    return this.http.get(url, { headers: headers, params: params }).toPromise()
      .then((response: any) => {
        if (response.body.totalProductos) {
          this.setTotalProducts(response.body.totalProductos);
        }
        return response.body.productos;
      });
  }


  getProductsByIdDetail(id: number) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/${id}`;
    return this.http.get(url, { headers: headers }).pipe(map((response: any) => response));
  }

  deleteProduct(params){
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/eliminar`;
    return this.http.put(url, params, { headers: headers }).pipe(map((response: any) => response));
  }


  removeMarkProduct(id: number | string): Promise<any> {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const params = {
    };
    const url = `${this.urlSapi}/productos/destacados/manuales/eliminar/${id}`;
    return this.http
      .post(url, params, { headers: headers })
      .toPromise();
  }


  receiveProduct(id): Promise<any> {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/recibido`;
    const params = {
      notificationId: id
    };
    return this.http.post(url, params, { headers: headers }).toPromise();
  }


  updateProductForm(id: number | string, params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/${id}`;
    return this.http.put(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  updateProductStatus(id: number | string, params): Promise<any> {
    let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    jsonSapiHeaders = Object.assign(jsonSapiHeaders);
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/${id}/estados`;
    return this.http
      .put(url, params, { headers: headers })
      .toPromise()
      .then((response: any) => response);
  }


  saveProductsForm(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = this.urlSapi + '/productos';
    return this.http.post(url, params, { headers: headers }).pipe(map((response: any) => response));
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
    return this.http.post(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  visitorCounter(productId) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/${productId}/visitas`;
    return this.http.put(url, { headers: headers }).pipe(map((response: any) => response));
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
    return this.http.put(url, { headers: headers }).pipe(map((response: any) => response));
  }

  reOrderProductChecked(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/destacados/manuales/reordenar`;
    return this.http.post(url, params, { headers: headers }).toPromise().then((response: any) => response);
  }

  reportProduct(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/reportar`;
    return this.http.put(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  sufiRegistro(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/sufi/registrar`;
    return this.http.put(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  setProductLocation(products, name, currentPage) {
    this.products = products;
    this.scroll = name;
    this.currentPage = currentPage;
  }

  setProductLocationFilter(carObject, currentFilter, filter , products, name, currentPage) {
    this.carObject = carObject;
    this.productsFilter = products;
    this.scrollFilter = name;
    this.currentPageFilter = currentPage;
    this.filter = filter;
    this.currentFilter = currentFilter;
  }

  setProductsFilter(products) {
    this.productsFilter = products;
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

  bancolombiaProduct() {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url =
      `${this.urlSapi}/productos/destacados/botones-pago`;
    return this.http.get(url, { headers: headers }).pipe(map((response: any) => response));
  }

  getProductLocationFilter() {
    if (document && this.scrollFilter) {
      if (document.getElementById(this.scrollFilter)) {
        document.getElementById(this.scrollFilter).scrollIntoView(true);
        this.scrollFilter = undefined;
      }
    }
  }

  featuredProduct(countryId, communityId) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url =
      `${this.urlSapi}/productos/referidos/destacados?ultimasHoras=48&pais=${countryId}&comunidad=${communityId}&cantidad=5&pagina=1`;
    return this.http.get(url, { headers: headers }).pipe(map((response: any) => response));
  }

  setBancolombiaProducts(bancolombiaProducts) {
    this.bancolombiaProducts = bancolombiaProducts;
  }

  setFeatureProducts(featuredProducts) {
    this.featuredProducts = featuredProducts;
  }

  getBancolombiaProducts() {
    return this.bancolombiaProducts;
  }

  getFeatureProducts() {
    return this.featuredProducts;
  }

  creditBAM(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/creditos/bam`;
    return this.http.post(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  countProductChecked(starSelected) {
    if (starSelected) {
      this.counterProductChecked++;
    } else {
      this.counterProductChecked--;
    }
  }

  setCounterProductChecked(counterProductChecked) {
    this.counterProductChecked = counterProductChecked;
  }

  getCounterProductChecked() {
    return this.counterProductChecked;
  }

  addCheckedProductArray(product) {
    this.paramsProductChecked.data.push(product);
    this.paramsProductChecked.data.filter(param => param != product);
  }

  getCheckedProductArray() {
    return this.paramsProductChecked;
  }

  setCheckedProductArray(data) {
    return this.paramsProductChecked.data = data;
  }

  getProductsShop(id: number) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/tiendas/${id}/productos`;
    return this.http.get(url, { headers: headers }).pipe(map((response: any) => response));
  }

}
