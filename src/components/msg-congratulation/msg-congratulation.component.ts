import { ROUTES } from './../../router/routes';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'msg-congratulation',
  templateUrl: './msg-congratulation.component.html',
  styleUrls: ['./msg-congratulation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsgCongratulationComponent implements OnInit {
  routeHome:string = `/${ROUTES.PRODUCTS.LINK}`;
  constructor( private productsService: ProductsService) { }

  ngOnInit() {
  }

  onReload() {
    this.productsService.setProducts([]);
  }

}
