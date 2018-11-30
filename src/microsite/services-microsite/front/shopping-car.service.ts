
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "../../../services/configuration.service";
import 'rxjs/add/operator/mergeMap';
import { ProductInterface } from "../../../commons/interfaces/product.interface";

@Injectable()
export class ShoppingCarService {
  public products: Array<any> = [];
  public checkedProducts: Array<any> = [];

  constructor(
  ) { }

  addProduct(product: any) {
    var exist: boolean = false;
    this.products.forEach(element => {
      if (element.id == product.id) {
        exist = true;
      }
    });
    if (!exist) {
      this.products.push(product);
    }

    return !exist;
  }

  getProducts() {
    return this.products;
  }

  deleteCheckedProducts() {
    var i = 0;
    while (i < this.products.length) {
      if (this.products[i].checked == true) {
        this.products.splice(i, 1);
      } else {
        i++;
      }
    }
    console.log(this.products)
  }

  checkProduct(id, isChecked) {
    if (isChecked) {
      this.checkedProducts.push({ "idProducto": id });
    } else {
      var i = 0;
      while (i < this.checkedProducts.length) {
        if (this.checkedProducts[i].idProducto == id) {
          this.checkedProducts.splice(i, 1);
        } else {
          i++;
        }
      }
    }
  }

  getCheckedProducts() {
    return this.checkedProducts;
  }

  updateProductQuantity(id, quantity) {
    this.products.forEach(element => {
      if (element.id == id) {
        element.quantity = quantity;
        element.totalPrice = element.price * element.quantity;
      }
    });
  }
}
