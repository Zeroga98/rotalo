import { ProductInterface } from './../../commons/interfaces/product.interface';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent{
  @Input() product: ProductInterface;

  constructor() { }

  getLocation(product):string{
    const city = product.user.city;
    const state = city.state;
    return `${city.name}, ${state.name}`;
  }

}
