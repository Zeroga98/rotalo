import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "../services/configuration.service";
import "rxjs/add/operator/mergeMap";
import { UserService } from "./user.service";
import { ProductInterface } from "../commons/interfaces/product.interface";

@Injectable()
export class ProductsService {
  readonly url = this.configurationService.getBaseUrl() + "/v1/products";
  public scroll: any;
  public products: Array<ProductInterface> = [];
  public currentPage = 0;

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
    private userService: UserService
  ) {}

  getProducts(params): Promise<any> {
    return this.http
      .get(this.url, { params: params })
      .toPromise()
      .then((response: any) => {
        response.data.lastPage = response.links.next === undefined;
        return response.data;
      });
  }

  getProductsById(id: number): Promise<any> {
    const url = `${this.url}/${id}`;
    return this.http
      .get(url)
      .toPromise()
      .then((response: any) => response.data);
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
    const url = `${this.url}/${id}/deliver`;
    const params = {
      data: {
        id,
        type: "products"
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

  saveProducts(params): Promise<any> {
    return this.http.post(this.url, this._buildParams(params)).toPromise();
  }

  private _buildParams(params): any {
    return {
      data: {
        attributes: params,
        type: "products"
      }
    };
  }

  setProductLocation(products, name, currentPage) {
    this.scroll = name;
    this.products = products;
    this.currentPage = currentPage;
  }
  getProductLocation() {
    if (document) {
      document.getElementById(this.scroll).scrollIntoView();
    }
  }
}
