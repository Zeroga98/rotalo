
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "../../../services/configuration.service";
import 'rxjs/add/operator/mergeMap';
import { ProductInterface } from "../../../commons/interfaces/product.interface";
import { ProductsMicrositeService } from "../back/products-microsite.service";

@Injectable()
export class ShoppingCarService {
  public products: Array<any> = [];
  public checkedProducts: Array<any> = [];

  constructor(
    private back: ProductsMicrositeService
  ) { }

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
      var i = 0;
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
    var json = 
    { 
      idProductos: this.checkedProducts
    }
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
}
