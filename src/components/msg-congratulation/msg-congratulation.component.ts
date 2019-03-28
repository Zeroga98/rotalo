import { ROUTES } from './../../router/routes';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'msg-congratulation',
  templateUrl: './msg-congratulation.component.html',
  styleUrls: ['./msg-congratulation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsgCongratulationComponent implements OnInit {
  public sold = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SOLD}`;
  constructor( private productsService: ProductsService) { }
  @Input() bancolombia = false;
  ngOnInit() {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }

  onReload() {
    this.productsService.setProducts([]);
  }

}
