import { Component, OnInit, Input } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { ProductInterface } from '../../commons/interfaces/product.interface';
import { ROUTES } from '../../router/routes';
import { Router } from '@angular/router';
import { ModalShareProductService } from '../modal-shareProduct/modal-shareProduct.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { NavigationService } from '../../pages/products/navigation.service';
import { CAROUSEL_PRODUCTS_CONFIG } from './carouselProducts.config';


@Component({
  selector: 'carousel-product',
  templateUrl: './carousel-product.component.html',
  styleUrls: ['./carousel-product.component.scss']
})
export class CarouselProductComponent implements OnInit {
  public carouselProductsConfig: NgxCarousel;
  @Input() products: Array<ProductInterface> = [];
  public idCountry = 1;
  readonly defaultImage: string = '../assets/img/product-no-image.png';

  constructor(private router: Router, private modalService: ModalShareProductService,
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

}
