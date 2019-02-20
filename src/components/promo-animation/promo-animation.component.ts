import { Component, OnInit, Input } from '@angular/core';
import { ModalPromoProductService } from '../modal-promo/modal-promoProduct.service';

@Component({
  selector: 'promo-animation',
  templateUrl: './promo-animation.component.html',
  styleUrls: ['./promo-animation.component.scss']
})
export class PromoAnimationComponent implements OnInit {
  @Input() promoCode;
  @Input() stickerUrl;

  constructor(private modalService: ModalPromoProductService) { }

  ngOnInit() {
  }

  openModalPromo(id: string) {
    const params = {
      code: this.promoCode
    };
    this.modalService.consultPromo(params).subscribe((response) => {
      this.gapush(
        'send',
        'event',
        'Concurso',
        'ClickReno',
        'Exitoso'
      );
      if (response.body) {
        this.modalService.open(id, true, response.body);
      }

    }, (error) => {
      this.gapush(
        'send',
        'event',
        'Concurso',
        'ClickReno',
        'NoExitoso'
      );
      this.modalService.open(id, false, null);
    });
  }

  gapush(method, type, category, action, label) {
    const paramsGa = {
      event: 'pushEventGA',
      method: method,
      type: type,
      categoria: category,
      accion: action,
      etiqueta: label
    };
    window['dataLayer'].push(paramsGa);
  }
}
