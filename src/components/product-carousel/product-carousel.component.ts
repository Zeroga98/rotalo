import { Component, OnInit, Input, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import { ROUTES } from '../../router/routes';
import { ProductInterface } from '../../commons/interfaces/product.interface';
import { ModalShareProductService } from '../modal-shareProduct/modal-shareProduct.service';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.scss']
})
export class ProductCarouselComponent implements OnInit, AfterContentInit {
  @Input() product;
  @Input() title;
  readonly defaultImage: string = '../assets/img/product-no-image.png';
  public idCountry = 1;
  public likeSelected = false;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private productsService: ProductsService,
    private router: Router,
    private modalService: ModalShareProductService) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    if (this.product['like']) {
      this.likeSelected = true;
    }
  }

  public getUrlProduct(product: ProductInterface) {
    const routeDetailProduct = `../../${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.SHOW
      }/${product['id']}`;
    return routeDetailProduct;
  }

  public isActivePromo(product) {
    if (product['special-date'] && product['special-date'].active
    || product['specialDate'] && product['specialDate'].active) {
      return true;
    }
    return false;
  }

  public updateSrc(evt) {
    evt.currentTarget.src = this.defaultImage;
  }

  public selectProductSuperUser(product: ProductInterface, event) {
    if (event.ctrlKey) {
      const url =  `${location.origin}/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${product['id']}`;
      window.open(url, '_blank');
    } else {
      const routeDetailProduct = `${ROUTES.PRODUCTS.LINK}/${
        ROUTES.PRODUCTS.SHOW
        }/${product['id']}`;
      this.router.navigate([routeDetailProduct]);
    }
  }


  public shareProduct(id: string, product) {
    if (product.id) {
      this.modalService.setProductId(product.id);
      this.modalService.open(id);
    }
  }

  public getLocation(product): string {
    const city = product.city;
    const state = city.state;
    return `${city.name}, ${state.name}`;
  }

  checkLike() {
    const params = {
      idProducto: this.product['id'],
      idTienda: this.product['seller_store_id']
    };
    if (!this.likeSelected) {
      this.likeSelected = true;
      this.productsService
        .selectLikeProduct(params)
        .subscribe(
          response => {
            if (response.body) {
              this.likeSelected = response.body.like;
              this.product['likes'] = response.body.likes;
              this.changeDetectorRef.markForCheck();
            }
          },
          error => {
            /*if (error.error.status == '623') {
              this.changeDetectorRef.markForCheck();
            }*/
            this.likeSelected = false;
            console.log(error);
          }
        );
    } else if (this.likeSelected) {
      this.likeSelected = false;
      this.productsService
        .selectLikeProduct(params)
        .subscribe(
          response => {
            if (response.body) {
              this.likeSelected = response.body.like;
              this.product['likes'] = response.body.likes;
              this.changeDetectorRef.markForCheck();
            }
          },
          error => {
            console.log(error);
          }
        );
    }

  }

  kFormatter() {
    if (this.product['likes']) {
      return Math.abs(this.product['likes']) > 9999 ?
      ((Math.abs(this.product['likes']) / 1000))  + 'K +' :
      this.product['likes'];
    }
    return 0;
  }


}
