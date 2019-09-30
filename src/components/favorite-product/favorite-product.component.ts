import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'favorite-product',
  templateUrl: './favorite-product.component.html',
  styleUrls: ['./favorite-product.component.scss']
})
export class FavoriteProductComponent implements OnInit {
  @Input() product;
  constructor() { }

  ngOnInit() {
  }

  getUrlImge(photo) {
    return ('url(' + photo.replace(/ /g, '%20') + ')') ;
  }


  get isProductAvailable() {
    return this.product.status == 'Disponible';
  }


}
