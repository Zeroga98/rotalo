
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '../../../services/configuration.service';

import { ProductInterface } from '../../../commons/interfaces/product.interface';
import { ProductsMicrositeService } from '../back/products-microsite.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ShoppingCarService {
  public products: Array<any> = [];
  public checkedProducts: Array<any> = [];
  readonly urlSapi = this.configurationService.getBaseSapiUrl();
  private totalProductsCart;
  private eventSourceCart = new BehaviorSubject<any>(null);
  currentEventCart = this.eventSourceCart.asObservable();
  private wayboxJson;


  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
    private back: ProductsMicrositeService
  ) { }

  setWayboxJson(wayboxJson) {
    this.wayboxJson = wayboxJson;
  }

  getWayboxJson() {
    return this.wayboxJson;
  }

  cleanWayboxJson() {
    this.wayboxJson = null;
  }

  setProducts(products) {
    this.products = products;
  }

  getProducts() {
    return this.products;
  }

  checkProduct(id, isChecked) {
    if (isChecked) {
      this.checkedProducts.push(id);
    } else {
      let i = 0;
      while (i < this.checkedProducts.length) {
        if (this.checkedProducts[i] == id) {
          this.checkedProducts.splice(i, 1);
        } else {
          i++;
        }
      }
    }
  }

  getCheckedProducts() {
    const json = {
      idProductos: this.checkedProducts
    };
    return json;
  }

  initCheckedList() {
    this.checkedProducts = [];
  }

  updateProductQuantity(id, quantity) {
    this.products.forEach(element => {
      if (element.id == id) {
        element.quantity = quantity;
      }
    });
  }

  getCartInfo() {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = this.urlSapi + '/carritos/productos/cantidades';
    return this.http.get(url, { headers: headers }).toPromise()
      .then((response: any) => {
        this.setTotalCartProducts(response.body.cantidadProductos);
        return response.body.cantidadProductos;
      });
  }

  setTotalCartProducts(totalCarts) {
    this.totalProductsCart = totalCarts;
  }

  getTotalCartProducts() {
    return this.totalProductsCart;
  }

  changeCartNumber(event) {
    this.eventSourceCart.next(event);
  }
}
