import { ProductInterface } from './../../commons/interfaces/product.interface';
import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnChanges{
  @Input() product: ProductInterface;

  constructor() { }

  ngOnChanges() {
    console.log(this.product);
  }

  getLocation(product):string{
    const city = product.user.city;
    const state = city.state;
    return `${city.name}, ${state.name}`;
  }

}
