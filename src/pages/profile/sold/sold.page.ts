import { ROUTES } from './../../../router/routes';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ProductsService } from '../../../services/products.service';
import { ProductInterface } from '../../../commons/interfaces/product.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { MASONRY_CONFIG } from '../selling/masonry.config';
import { CurrentSessionService } from '../../../services/current-session.service';

@Component({
  selector: 'sold',
  templateUrl: './sold.page.html',
  styleUrls: ['./sold.page.scss']
})
export class SoldPage implements OnInit {
  public notificationsUrl: string = `/${ROUTES.ROTALOCENTER}`;
  public isSpinnerShow = true;
  public currentTab: String;
  public productsSold: Array<any> = [];
  public productsPurchased: Array<any> = [];
  public pageNumberSold: number = 1;
  public totalItemsSold: number = 1;
  public pageNumberPurchased: number = 1;
  public totalItemsPurchased: number = 1;
  public  showPagination = true;
  private currentFilterSold: any = {
    'staged': 'vendiste',
    'number': 1,
    'size': '9'
  };
  private currentFilterPurchased: any = {
    'staged': 'compraste',
    'number': 1,
    'size': '9'
  };
  private userId;
  public showEmptySold = false;
  public showEmptyPurchase = false;
  constructor(
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private productsService: ProductsService,
    private currentSessionService: CurrentSessionService
  ) {
    this.userId = this.currentSessionService.getIdUser();
  }

  ngOnInit() {
    this.currentTab = 'sold';
    this.loadProductsSold();
    this.loadProductsPurchased();
  }

  loadProductsSold() {
    this.productsService.loadProductsVendidosComprados(this.currentFilterSold).then(products => {
      this.totalItemsSold = products.totalProductos;
      this.productsSold = [].concat(products.productos);
      this.thereIsSold(this.productsSold);
      this.isSpinnerShow = false;
    });
  }

  loadProductsPurchased() {
    this.productsService.loadProductsVendidosComprados(this.currentFilterPurchased).then(products => {
      this.totalItemsPurchased = products.totalProductos;
      this.productsPurchased = [].concat(products.productos);
      this.thereIsPurchased(this.productsPurchased);
      this.isSpinnerShow = false;
    });
  }

  thereIsSold(product) {
    if (product) {
      if (product.length <= 0) {
        this.showEmptySold = true;
      } else {
        this.showEmptySold = false;
      }
    }
  }

  thereIsPurchased(product) {
    if (product) {
      if (product.length <= 0) {
        this.showEmptyPurchase = true;
      } else {
        this.showEmptyPurchase = false;
      }
    }
  }

  sanitizePhoto(photo: String): any {
    let trustPhoto;
    trustPhoto = this.sanitizer.bypassSecurityTrustStyle('url(' + photo + ')');
    return trustPhoto;
  }

  updateProduct($event) {
    if ($event) {
      this.loadProductsSold();
    }
  }

  updateProductPurchased($event) {
    if ($event) {
      this.loadProductsSold();
    }
  }

  getPageSold(page: number) {
    this.pageNumberSold = page;
    this.currentFilterSold =
    {
      'staged': 'vendiste',
      'number': page,
      'size': '9'
    }
    this.loadProductsSold();
    window.scrollTo(0, 0);
  }

  getPagePurchased(page: number) {
    this.pageNumberPurchased = page;
    this.currentFilterPurchased =
    {
      'staged': 'compraste',
      'number': page,
      'size': '9'
    }
    this.loadProductsPurchased();
    window.scrollTo(0, 0);
  }

}
