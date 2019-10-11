import { Component, OnInit, Input } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { ProductInterface } from '../../commons/interfaces/product.interface';
import { CurrentSessionService } from '../../services/current-session.service';
import { NavigationService } from '../../pages/products/navigation.service';
import { CAROUSEL_PRODUCTS_CONFIG } from './carouselCategory.config';
import { ProductsService } from '../../services/products.service';


@Component({
  selector: 'carousel-category',
  templateUrl: './carousel-category.component.html',
  styleUrls: ['./carousel-categor.component.scss']
})
export class CarouselCategoryComponent implements OnInit {
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
