import { ROUTES } from './../../../router/routes';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ProductsService } from '../../../services/products.service';
import { ProductInterface } from '../../../commons/interfaces/product.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { MASONRY_CONFIG } from '../selling/masonry.config';

@Component({
  selector: 'sold',
  templateUrl: './sold.page.html',
  styleUrls: ['./sold.page.scss']
})
export class SoldPage implements OnInit {
  public notificationsUrl: string = `/${ROUTES.ROTALOCENTER}`;
  public isSpinnerShow = true;
  public currentTab: String;
  public productsSold: Array<ProductInterface> = [];
  public productsPurchased: Array<ProductInterface> = [];
  private currentFilterSold: any = {
    'filter[staged]': 'sold'
  };
  private currentFilterPurchased: any = {
    'filter[staged]': 'purchased'
  };
  public masonryConfig = MASONRY_CONFIG;

  constructor(private sanitizer: DomSanitizer, private userService: UserService, private productsService: ProductsService) {
    this.loadProductsSold();
    this.loadProductsPurchased();
  }

  async loadProductsSold() {
    this.productsService.getProducts(this.currentFilterSold).then(products => {
        this.productsSold = [].concat(products);
        this.isSpinnerShow = false;
    });
  }
  async loadProductsPurchased() {
    this.productsService.getProducts(this.currentFilterPurchased).then(products => {
        this.productsPurchased = [].concat(products);
        this.isSpinnerShow = false;
    });
  }
  ngOnInit() {
    this.currentTab = 'sold';
  }

  sanitizePhoto(photo: String): any {
   let trustPhoto;
   trustPhoto =  this.sanitizer.bypassSecurityTrustStyle('url(' + photo + ')');
   return trustPhoto;
  }
}
