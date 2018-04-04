import { Component, OnInit, Input } from '@angular/core';
import { ROUTES } from '../../router/routes';
import { Router } from '@angular/router';

@Component({
  selector: 'modal-buy-info',
  templateUrl: './modal-buy-info.component.html',
  styleUrls: ['./modal-buy-info.component.scss']
})
export class ModalBuyInfoComponent implements OnInit {
  @Input() idProduct: string;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  buyProduct() {
    const urlBuyProduct = `${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.BUY
    }/${this.idProduct}`;
    this.router.navigate([urlBuyProduct]);
  }
}
