import { ProductInterface } from '../../../commons/interfaces/product.interface';
import { ProductsService } from '../../../services/products.service';
import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ROUTES } from '../../../router/routes';
import { CurrentSessionService } from '../../../services/current-session.service';


@Component({
  selector: 'products-edit-microsite',
  templateUrl: './products-edit-microsite.component.html',
  styleUrls: ['./products-edit-microsite.component.scss']
})
export class ProductsEditMicrositeComponent implements OnInit {
  idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ""));
  product: ProductInterface;
  constructor(
    private router: Router,
    private productsService: ProductsService,
    private currentSessionService: CurrentSessionService
  ) { }

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct() {
    this.productsService.getProductsByIdDetail(this.idProduct).subscribe((reponse) => {
      if (reponse.body) {
        this.product = reponse.body.productos[0];
        this.redirectIfisNotOwner(this.product);
      }
    } ,
    (error) => {
      console.log(error);
    });
  }

  redirectIfisNotOwner(product) {
    const idUser = this.currentSessionService.getIdUser();
    if (product.user.id != idUser) {
      this.router.navigate([
        `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
      ]);
    }
  }

  updatePhoto(event) {
    this.productsService.updateProductForm(this.idProduct, event).subscribe((response) => {
      this.router.navigate([
        `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SELLING}`
      ]);
      this.productsService.products = [];
    },
      (error) => {
        console.log(error);
      }
    );
  }


}
