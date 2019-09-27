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


  constructor(
    private productsService: ProductsService,
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
  }



}
