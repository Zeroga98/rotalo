import { Component, OnInit } from '@angular/core';
import { ModalPromoProductService } from '../modal-promo/modal-promoProduct.service';

@Component({
  selector: 'promo-animation',
  templateUrl: './promo-animation.component.html',
  styleUrls: ['./promo-animation.component.scss']
})
export class PromoAnimationComponent implements OnInit {

  constructor(private modalService: ModalPromoProductService) { }

  ngOnInit() {
  }

  openModalPromo(id: string) {
    this.modalService.open(id);
  }


}
