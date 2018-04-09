import { EventEmitter, Component, OnInit, Input, Output } from '@angular/core';
import { ROUTES } from '../../router/routes';
import { Router } from '@angular/router';

@Component({
  selector: 'modal-buy-info',
  templateUrl: './modal-buy-info.component.html',
  styleUrls: ['./modal-buy-info.component.scss']
})
export class ModalBuyInfoComponent implements OnInit {
  @Input() idProduct: string;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  constructor(private router: Router) { }

  ngOnInit() {
  }
  buyProduct() {
    const urlBuyProduct = `${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.BUY
    }/${this.idProduct}`;
    this.router.navigate([urlBuyProduct]);
  }

  closeModalBuy() {
    this.closeModal.emit({isModalBuyShowed: false, isModalSendMessageShowed: true});
  }
}
