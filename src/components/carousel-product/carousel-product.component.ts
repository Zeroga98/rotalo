import { Component, OnInit, Input } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { ProductInterface } from '../../commons/interfaces/product.interface';
import { ROUTES } from '../../router/routes';
import { Router } from '@angular/router';
import { ModalShareProductService } from '../modal-shareProduct/modal-shareProduct.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { NavigationService } from '../../pages/products/navigation.service';
import { CAROUSEL_PRODUCTS_CONFIG } from './carouselProducts.config';
import { ProductsService } from '../../services/products.service';


@Component({
  selector: 'carousel-product',
  templateUrl: './carousel-product.component.html',
  styleUrls: ['./carousel-product.component.scss']
})
export class CarouselProductComponent implements OnInit {
  public carouselProductsConfig: NgxCarousel;
  @Input() products: Array<ProductInterface> = [];
  @Input() title;
  @Input() imgRoute;
  public idCountry = 1;
  readonly defaultImage: string = '../assets/img/product-no-image.png';
  public likeSelected = [];

  constructor(
    private productsService: ProductsService,
    private router: Router, private modalService: ModalShareProductService,
    private currentSession: CurrentSessionService, private navigationService: NavigationService) {
      this.carouselProductsConfig = CAROUSEL_PRODUCTS_CONFIG;
    }

  ngOnInit() {
    let countryId;
    if (this.navigationService.getCurrentCountryId()) {
      countryId = this.navigationService.getCurrentCountryId();
    } else {
      countryId = this.currentSession.currentUser()['countryId'];
    }
    if (this.products) {
      for (let i = 0; i < this.products.length; i++) {
        this.likeSelected.push(false);
      }
    }
    this.idCountry = countryId;
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

  public updateSrc(evt) {
    evt.currentTarget.src = this.defaultImage;
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

  checkLike(product, index) {
    const params = {
      idProducto: product['id'],
      idTienda: product['seller_store_id']
    };

    if (!this.likeSelected[index]) {
      this.likeSelected[index] = true;
      this.productsService
        .selectLikeProduct(params)
        .subscribe(
          response => {
            if (response.body) {
              this.likeSelected[index] = response.body.like;
              product['product_likes'] = response.body.likes;
            }
          },
          error => {
            /*if (error.error.status == '623') {
              this.changeDetectorRef.markForCheck();
            }*/
            this.likeSelected[index] = false;
            console.log(error);
          }
        );
    } else if (this.likeSelected[index]) {
      this.likeSelected[index] = false;
      this.productsService
        .selectLikeProduct(params)
        .subscribe(
          response => {
            if (response.body) {
              this.likeSelected[index] = response.body.like;
              product['product_likes'] = response.body.likes;
            }
          },
          error => {
            console.log(error);
          }
        );
    }
  }


  kFormatter(product) {
    if (product['product_likes']) {
      return Math.abs(product['product_likes']) > 9999 ?
      ((Math.abs(product['product_likes']) / 1000))  + 'K +' :
       product['product_likes'];
    }
    return 0;
  }

}
