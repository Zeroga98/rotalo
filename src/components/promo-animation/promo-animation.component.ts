import { Component, OnInit, Input } from '@angular/core';
import { ModalPromoProductService } from '../modal-promo/modal-promoProduct.service';

@Component({
  selector: 'promo-animation',
  templateUrl: './promo-animation.component.html',
  styleUrls: ['./promo-animation.component.scss']
})
export class PromoAnimationComponent implements OnInit {
  @Input() promoCode;

  constructor(private modalService: ModalPromoProductService) { }

  ngOnInit() {
  }

  openModalPromo(id: string) {
    const params = {
      code: this.promoCode
    };
    this.modalService.consultPromo(params).subscribe((response) => {
      console.log(response);
      this.modalService.open(id, true);
    }, (error) => {
      console.log(error);
      this.modalService.open(id, false);
    });
  }




}
