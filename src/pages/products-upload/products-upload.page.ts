import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ROUTES } from '../../router/routes';
import { UserService } from '../../services/user.service';
import { ModalUploadProductService } from '../../components/modal-uploadProduct/modal-uploadProduct.service';


@Component({
  selector: 'roducts-upload',
  templateUrl: './products-upload.page.html',
  styleUrls: ['./products-upload.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsUploadPage implements OnInit, OnDestroy {
  constructor(
    private productsService: ProductsService,
    private router: Router,
    private userService: UserService,
    private modalService: ModalUploadProductService,
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {
  }

  publishPhoto (event) {
    this.productsService.saveProductsForm(event).subscribe((response) => {
      this.gapush('send', 'event', 'Ofertas', 'ClicFormularioOferta', 'SubirOfertaExitosa');
      this.userService.updateInfoUser();
      if (response.body && response.body.producto) {
        this.shareProduct('custom-modal-3', response.body.producto.id);
      }
    },
    (error) => {
      console.error('Error: ', error);
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

  shareProduct(id: string, idProduct) {
    if (idProduct) {
      this.modalService.setProductId(idProduct);
      this.modalService.open(id);
    }
  }
}
