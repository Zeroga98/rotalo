
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "../../../services/configuration.service";
import 'rxjs/add/operator/mergeMap';
import { Router } from "@angular/router";
import { ProductInterface } from "../../commons-microsite/interfaces/product.interface";
import { URLS } from '../../commons-microsite/constants/url-services';
import { ConfigurationMicrositeService } from '../configuration/configuration-microsite.service';

@Injectable()
export class ProductsMicrositeService {
  readonly url = this.configurationService.getBaseUrl() + '/productos/productos-tienda';
  readonly urlSapi = this.configurationService.getBaseSapiUrl();
  public products: Array<ProductInterface> = [];
  private urlDetailProduct;
  private totalProducts = 0;

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
    private router: Router,
    private config: ConfigurationMicrositeService
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

  getProducts(idUser, params): Promise<any> {
    console.log(idUser)
    /*
    const headersService = this.config.getHeaders();
    const headers = new HttpHeaders(headersService); 
    */
    

      let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
      jsonSapiHeaders = Object.assign(jsonSapiHeaders, { userid: idUser });
      const headers = new HttpHeaders(jsonSapiHeaders);
      const url = this.urlSapi + '/productos';
      return this.http.get(url, { headers: headers,  params: params }).toPromise()
      .then((response: any) => {
      if (response.body.totalProductos) {
        this.setTotalProducts (response.body.totalProductos);
      }
      return response.body.productos;
      });
  }

  getProductsById(id: number): Promise<any> {
    const url = `${this.url}/${id}`;
    return this.http
      .get(url)
      .toPromise()
      .then((response: any) => response.data);
  }
  /*
    shareProduct(params, productId) {
      const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(jsonSapiHeaders);
      const url = `${this.urlSapi}/productos/${productId}/referidos`;
      return this.http.post(url, params, { headers: headers }).toPromise().then((response: any) => response);
    }
  */
}
