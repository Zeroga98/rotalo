
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "../../../services/configuration.service";
import 'rxjs/add/operator/mergeMap';
import { ProductInterface } from "../../../commons/interfaces/product.interface";

@Injectable()
export class ShoppingCarService {
  public products: Array<ProductInterface> = [];

  constructor(
  ) { }

  addProduct(product: ProductInterface) {
    this.products.push(product);  
  }

  getProducts() {
    console.log(this.products);
    return this.products;   
  }
}
