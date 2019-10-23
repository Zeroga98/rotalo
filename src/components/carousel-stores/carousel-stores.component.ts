import { Component, OnInit, Input } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { ProductInterface } from '../../commons/interfaces/product.interface';
import { CurrentSessionService } from '../../services/current-session.service';
import { NavigationService } from '../../pages/products/navigation.service';
import { CAROUSEL_PRODUCTS_CONFIG } from './carouselStores.config';
import { ProductsService } from '../../services/products.service';


@Component({
  selector: 'carousel-stores',
  templateUrl: './carousel-stores.component.html',
  styleUrls: ['./carousel-stores.component.scss']
})
export class CarouselStoresComponent implements OnInit {
  public carouselProductsConfig: NgxCarousel;
  @Input() products: Array<ProductInterface> = [];
  @Input() title;
  @Input() imgRoute;

  public stores = [
    { name: 'La tienda Bancolombia', img: 'bancolombia-store', logo: 'tiendaBancolombia' },
    { name: 'Tienda del inmueble', img: 'inmueble-store', logo: 'inmueble' },
    { name: 'Feria Sufi', img: 'sufi-store', logo: 'sufiStore' },
    { name: 'Tienda del inmueble', img: 'inmueble-store', logo: 'tiendaBancolombia' }]

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
