import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { ProductInterface } from '../../../commons/interfaces/product.interface';
import { UserService } from '../../../services/user.service';
import { MASONRY_CONFIG } from './masonry.config';
@Component({
  selector: 'selling',
  templateUrl: './selling.page.html',
  styleUrls: ['./selling.page.scss']
})
export class SellingPage implements OnInit {
  public products: Array<ProductInterface> = [];
  public userEdit: any;
  private filterProduct: any;
  public isSpinnerShow = true;
  public currentTab: String;
  public masonryConfig = MASONRY_CONFIG;
  public productsExpired: Array<ProductInterface> = [];
  private currentFilterExpired: any = {
    'filter[staged]': 'expired'
  };
  constructor(private productsService: ProductsService, private userService: UserService) { }

  ngOnInit() {
    this.currentTab = 'selling';
    this.getInfoUser();
    this.loadProductsExpired();
    this.isSpinnerShow = false;
  }

  async getInfoUser() {
    this.userEdit = await this.userService.getInfoUser();
    this.filterProduct = {
      'filter[staged]': 'selling',
      'page[number]': '1',
      'page[size]': '100'
    };
    this.getProductsSelling(this.filterProduct);
  }

  async getProductsSelling(filter) {
    this.productsService.getProducts(filter).then(products => {
        this.products = [].concat(products);
    });
  }

  async loadProductsExpired() {
    this.productsService.getProducts(this.currentFilterExpired).then(products => {
        this.productsExpired = [].concat(products);
    });
  }


}
