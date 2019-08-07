import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
  public errorference = '';
  public photosUploadedRest = null;
  constructor(
    private productsService: ProductsService,
    private router: Router,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: ModalUploadProductService,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  publishPhoto (event) {
    this.errorference = '';
    this.productsService.saveProductsForm(event).subscribe((response) => {
      this.userService.updateInfoUser();
      if (response.body && response.body.productos) {
        this.photosUploadedRest = 0;
        this.shareProduct('custom-modal-3', response.body.productos.id);
      }
    },
    (error) => {
      if (error.error) {
        this.errorference = error.error.message;
        this.changeDetectorRef.markForCheck();
      }
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
