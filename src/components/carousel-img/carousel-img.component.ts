import { Component, OnInit, Input } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { ProductInterface } from '../../commons/interfaces/product.interface';
import { CurrentSessionService } from '../../services/current-session.service';
import { NavigationService } from '../../pages/products/navigation.service';
import { CAROUSEL_PRODUCTS_CONFIG } from './carouselImg.config';
import { ProductsService } from '../../services/products.service';


@Component({
  selector: 'carousel-img',
  templateUrl: './carousel-img.component.html',
  styleUrls: ['./carousel-img.component.scss']
})
export class CarouselImgComponent implements OnInit {
  public carouselProductsConfig: NgxCarousel;
  @Input() products: Array<ProductInterface> = [];
  @Input() title;
  @Input() imgRoute;
  @Input() type;


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
