import { ProductInterface } from './../../commons/interfaces/product.interface';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ROUTES } from '../../router/routes';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent{
  @Input() product: ProductInterface;
  productLink: string = `/${ROUTES.PRODUCTS.LINK}/show`;

  constructor() {
  }

  getLocation(product):string{
    const city = product.user.city;
    const state = city.state;
    return `${city.name}, ${state.name}`;
  }

}
