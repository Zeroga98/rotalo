import {
  Component,
  OnInit, Input, Output, EventEmitter
} from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

import { CAROUSEL_CONFIG } from './../detail-product-microsite/carousel.config';
import { NgxCarousel } from 'ngx-carousel';
import { ShoppingCarService } from '../../services-microsite/front/shopping-car.service';

@Component({
  selector: 'mini-product-detail',
  templateUrl: 'mini-product-detail.component.html',
  styleUrls: ['mini-product-detail.component.scss']
})
export class MiniProductDetailComponent implements OnInit {

  @Input() product;
  @Output() changeQuantity: EventEmitter<number> = new EventEmitter();

  public carouselConfig: NgxCarousel;
  public productsPhotos: any;
  public productPhoto: any;
  public initialQuantity;
  public quantityForm;
  public totalStock;
  classCheckSelected = false;
  ngOnInit() {
    console.log(this.product)
    this.initProductInfo();
    this.initQuantityForm();
  }

  constructor(
    private fb: FormBuilder,
    private car: ShoppingCarService
  ) {
    this.carouselConfig = CAROUSEL_CONFIG;
  }

  initProductInfo() {
    this.productsPhotos = [].concat(this.product.product.photos);
    this.productPhoto = this.productsPhotos[0].url;
    this.totalStock = this.product.product.stock;
    this.initialQuantity = this.product.quantity;
  }

  initQuantityForm() {
    this.quantityForm = this.fb.group(
      {
        stock: [this.initialQuantity, [Validators.required, Validators.min(1), Validators.max(this.totalStock)]]
      }
    );
  }

  addStock() {
    if (this.quantityForm.get('stock').value < this.totalStock) {
      let stock = this.quantityForm.get('stock').value;
      stock = ++stock;
      this.quantityForm.patchValue({ stock: stock });
      this.changeQuantity.emit(stock)
    }
  }

  minusStock() {
    if (this.quantityForm.get('stock').value > 1) {
      let stock = this.quantityForm.get('stock').value;
      stock = --stock;
      this.quantityForm.patchValue({ stock: stock });
      this.changeQuantity.emit(stock)
    }
  }

  clickCheckProduct() {
    this.classCheckSelected = !this.classCheckSelected;
    this.car.checkProduct(this.product.product.id, this.classCheckSelected);
  }

  onChange(event) {
    let stock = this.quantityForm.get('stock').value;
    this.changeQuantity.emit(stock)
  }
}