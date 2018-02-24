import { Component, OnInit } from '@angular/core';
import { CAROUSEL_CONFIG } from './carousel.config';
import { NgxCarousel } from 'ngx-carousel';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import { ProductsService } from '../../services/products.service';
import { ROUTES } from '../../router/routes';
import { Router } from '@angular/router';

@Component({
  selector: 'detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss']
})
export class DetalleProductoComponent implements OnInit {
  public carouselConfig: NgxCarousel;
  public products: Array<ProductInterface> = [];
  public productsPhotos: any;
  idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ''));

  constructor(private productsService: ProductsService, private router: Router) {
    this.carouselConfig = CAROUSEL_CONFIG;
  }

  ngOnInit() { 
    this.loadProduct();
  }

  loadProduct() {
    this.productsService.getProductsById(this.idProduct).then(prod => {
      this.products = [].concat(prod);      
      if(typeof this.products[0].photos != undefined){
        this.productsPhotos = [].concat(this.products[0].photos);
        this.products[0].photos = this.productsPhotos;
      }
    });
  }

  isSpinnerShow(): boolean {
      return this.products.length > 0;
  }

  getLocation(product):string{
    const city = product.user.city;
    const state = city.state;
    return `${city.name}, ${state.name}`;
  }

  validateSession(){
    //poner id del usuario logueado
    return this.products[0].user.id == "3061" && this.products[0].status === 'active';
  }

}
