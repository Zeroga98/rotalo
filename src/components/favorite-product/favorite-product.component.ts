import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../router/routes';
import { ConfigurationService } from '../../services/configuration.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'favorite-product',
  templateUrl: './favorite-product.component.html',
  styleUrls: ['./favorite-product.component.scss']
})
export class FavoriteProductComponent implements OnInit {
  @Input() product;
  @Output() unlike = new EventEmitter<string>();
  constructor(
    private router: Router,
    private productsService: ProductsService,
    private configurationService: ConfigurationService
  ) {}

  ngOnInit() {}

  getUrlImge(photo) {
    const urlProduct: String = 'url("' + photo.replace(/ /g, '%20') + '")';
    return urlProduct;
  }

  get isProductAvailable() {
    return this.product && this.product.status == 'Disponible';
  }

  get isCostume() {
    if (
      this.product['subcategory'] &&
      (this.product['subcategory'].id == 77 ||
        this.product['subcategory'].id == 127)
    ) {
      return true;
    }
    return false;
  }

  goToProduct() {
    if (this.isProductAvailable) {
      if (this.product && !this.product.storeId) {
        this.router.navigate([
          `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${this.product.productId}`
        ]);
      } else if (
        this.product &&
        this.product.storeId == this.configurationService.storeIdPrivate
      ) {
        this.router.navigate([
          `/${ROUTES.SHOPSPRIVATE.LINK}/${ROUTES.SHOPSPRIVATE.SHOW}/${this.product.productId}`
        ]);
      } else if ( this.product &&
        this.product.storeId == 1) {
          this.router.navigate([
            `${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${
              ROUTES.MICROSITE.DETAIL
              }/${this.product.productId}`
          ]);
      }
    }
  }

  checkLike() {
    const params = {
      idProducto: this.product['productId'],
      idTienda: this.product['storeId']
    };
    this.productsService
        .selectLikeProduct(params)
        .subscribe(
          response => {
            if (response.body) {
              this.unlike.emit(this.product['productId']);
            }
          },
          error => {
            console.log(error);
          }
        );
  }
}
