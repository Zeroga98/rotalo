import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ProductsService } from '../../../services/products.service';
import { ProductInterface } from '../../../commons/interfaces/product.interface';
@Component({
  selector: 'sold',
  templateUrl: './sold.page.html',
  styleUrls: ['./sold.page.scss']
})
export class SoldPage implements OnInit {
  public currentTab: String;
  public productsSold: Array<ProductInterface> = [];
  public productsPurchased: Array<ProductInterface> = [];
  private currentFilterSold: any = {
    'filter[staged]': 'sold'
  };
  private currentFilterPurchased: any = {
    'filter[staged]': 'purchased'
  };

  constructor(private userService: UserService, private productsService: ProductsService) {
    this.loadProductsSold();
    this.loadProductsPurchased();
  }

  async loadProductsSold() {
    this.productsService.getProducts(this.currentFilterSold).then(products => {
        this.productsSold = [].concat(products);
    });
  }
  async loadProductsPurchased() {
    this.productsService.getProducts(this.currentFilterPurchased).then(products => {
        this.productsPurchased = [].concat(products);
    });
  }
  ngOnInit() {
    this.currentTab = 'sold';
  }

}
