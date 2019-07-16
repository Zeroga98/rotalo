import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ModalUploadProductService } from '../../../components/modal-uploadProduct/modal-uploadProduct.service';


@Component({
  selector: 'products-upload-microsite',
  templateUrl: './products-upload-microsite.component.html',
  styleUrls: ['./products-upload-microsite.component.scss']
})
export class ProductsUploadMicrositeComponent implements OnInit, OnDestroy {

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private userService: UserService,
    private modalService: ModalUploadProductService,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  publishPhoto (event) {
    this.productsService.saveProductsForm(event).subscribe((response) => {

      this.userService.updateInfoUser();
      if (response.body && response.body.producto) {
        this.shareProduct('custom-modal-3', response.body.producto.id);
      }
    },
    (error) => {
      console.error('Error: ', error);
    });
  }

  shareProduct(id: string, idProduct) {
    if (idProduct) {
      this.modalService.setProductId(idProduct);
      this.modalService.open(id);
    }
  }

}
