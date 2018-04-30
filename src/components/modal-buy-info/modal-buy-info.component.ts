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
  @Input() statusProduct: string;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  titleModal: String = "¡Un segundo!";
  descriptionModal: String = 'Antes de continuar con tu compra, asegúrate de haber hablado con el vendedor para que confirmes la disponibilidad del producto y acuerden la forma de pago y entrega. Recuerda que podrás necesitar información adicional dependiendo de la forma de pago que pactes con el vendedor.';
  constructor(private router: Router) { }

  ngOnInit() {
    this.changeModalSellProcess();
  }

  buyProduct() {
    const urlBuyProduct = `${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.BUY
    }/${this.idProduct}`;
    this.router.navigate([urlBuyProduct]);
  }

  goToProduct() {
    const urlBuyProduct = `${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.SHOW
    }/${this.idProduct}`;
    this.router.navigate([urlBuyProduct]);
  }

  isSellProcess() {
   return this.statusProduct === "sell_process";
  }

  changeModalSellProcess() {
    if (this.isSellProcess()) {
      this.titleModal = '¡Alguien más está comprando!';
      this.descriptionModal = `Actualmente esto producto está en proceso de venta y se ha
      deshabilitado la opción de compra hasta que finalice el proceso.
      Vuelve más tarde o comunícate con el vendedor para comprobar si
      el producto aún está disponible.`;
    }else {
      this.titleModal =  '¡Un segundo!';
      this.descriptionModal = `Antes de continuar con tu compra,
      asegúrate de haber hablado con el vendedor para que confirmes la disponibilidad del producto y acuerden la forma de pago y entrega.
      Recuerda que podrás necesitar información adicional dependiendo de la forma de pago que pactes con el vendedor.`;
    }
  }

  closeModalBuy() {
    this.closeModal.emit({isModalBuyShowed: false, isModalSendMessageShowed: true});
  }

  onlyCloseModal() {
    this.closeModal.emit({isModalBuyShowed: false});
    this.goToProduct();
  }
}
