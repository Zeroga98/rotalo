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
  public showEmptyProduct = false;
  public showEmptyExpired = false;
  public currentTab: String;
  public masonryConfig = MASONRY_CONFIG;
  public productsExpired: Array<any> = [];
  public pageNumber: number = 1;
  public totalItems: number = 1;
  public pageNumberExpired: number = 1;
  public totalItemsExpired: number = 1;
  public  showPagination = true;
  private currentFilterExpired: any = {
    'staged': 'vencidos',
    'number': 1,
    'size': '9'
  };

  constructor(
    private productsService: ProductsService,
    private userService: UserService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.currentTab = 'selling';
    this.getInfoUser();
    this.loadProductsExpired();
  }

  getPage(page: number) {
    this.pageNumber = page;
    this.filterProduct = {
      'staged': 'rotando',
      'number': page,
      'size': '9'
    };
    this.getProductsSelling(this.filterProduct);
    window.scrollTo(0, 0);
  }

  getPageExpired(page: number) {
    this.pageNumberExpired = page;
    this.currentFilterExpired = {
      'staged': 'vencidos',
      'number': page,
      'size': '9'
    };
    this.loadProductsExpired();
    window.scrollTo(0, 0);
  }

  thereIsSelling(products) {
    if (products) {
      if (products.length <= 0) {
        this.showEmptyProduct = true;
      } else {
        this.showEmptyProduct = false;
      }
    }
  }

  thereIsExpired(product) {
    if (product) {
      if (product.length <= 0) {
         this.showEmptyExpired = true;
      } else {
         this.showEmptyExpired = false;
      }
    }
  }

  async getInfoUser() {
    this.userEdit = await this.userService.getInfoUser();
    this.filterProduct = {
      'staged': 'rotando',
      'number': '1',
      'size': '9'
    };
    this.getProductsSelling(this.filterProduct);
  }

  async getProductsSelling(filter) {
    this.productsService.loadProductsRotandoVencidos(filter).then(products => {
      if (products && products.productos) {
        this.totalItems = products.totalProductos;
        this.products = [].concat(products.productos);
        this.thereIsSelling(this.products);
        this.isSpinnerShow = false;
      }
    });
  }

  async loadProductsExpired() {
    this.productsService
      .loadProductsRotandoVencidos(this.currentFilterExpired)
      .then(products => {
        if (products && products.productos) {
          this.totalItemsExpired = products.totalProductos;
          this.productsExpired = [].concat(products.productos);
          this.thereIsExpired( this.productsExpired);
          this.isSpinnerShow = false;
        }
      });
  }

  updateInfoSelling($event) {
    if ($event) {
      location.reload();
    }
  }

  updateExpired($event) {
    if ($event) {
      location.reload();
    }
  }

  updateProduct($event) {
    if ($event) {
      this.getProductsSelling(this.filterProduct);
    }
  }

  updateProductExpired($event) {
    if ($event) {
      this.loadProductsExpired();
    }
  }


}
