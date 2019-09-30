import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../router/routes';

@Component({
  selector: 'favorite-product',
  templateUrl: './favorite-product.component.html',
  styleUrls: ['./favorite-product.component.scss']
})
export class FavoriteProductComponent implements OnInit {
  @Input() product;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  getUrlImge(photo) {
    return ('url(' + photo.replace(/ /g, '%20') + ')') ;
  }

  get isProductAvailable() {
    return this.product && this.product.status == 'Disponible';
  }

  get isCostume () {
    if ((this.product['product_subcategory_id'] &&
    (this.product['product_subcategory_id'] == 77 || this.product['product_subcategory_id'] == 127))) {
      return true;
    }
    return false;
  }

  goToProduct() {
    this.router.navigate([
      `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${this.product.productId}`
    ]);
  }


}
