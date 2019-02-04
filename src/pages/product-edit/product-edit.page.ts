import { ProductInterface } from './../../commons/interfaces/product.interface';
import { ProductsService } from './../../services/products.service';
import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ROUTES } from '../../router/routes';
import { CurrentSessionService } from '../../services/current-session.service';

@Component({
  selector: "product-edit",
  templateUrl: "./product-edit.page.html",
  styleUrls: ["./product-edit.page.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductEditPage implements OnInit {
  idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ""));
  product: ProductInterface;
  constructor(
    private router: Router,
    private productsService: ProductsService,
    private changeDetectorRef: ChangeDetectorRef,
    private currentSessionService: CurrentSessionService
  ) {}

  ngOnInit() {
    this.loadProduct();
  }

  /*async loadProduct() {
    try {
      this.product = await this.productsService.getProductsById(this.idProduct);
      this.redirectIfisNotOwner(this.product);
      this.changeDetectorRef.markForCheck();
    } catch (error) {}
  }*/

  loadProduct() {
    this.productsService.getProductsByIdDetail(this.idProduct).subscribe((reponse) => {
      if (reponse.body) {
        this.product = reponse.body.productos[0];
        this.redirectIfisNotOwner(this.product);
        this.changeDetectorRef.markForCheck();
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

  /*async updatePhoto(event) {
    try {
      const response = await this.productsService.updateProduct(this.idProduct, event);
      this.router.navigate([
        `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SELLING}`
      ]);
      this.productsService.products = [];
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      console.error("Error: ", error);
    }
  }*/


  updatePhoto(event) {
    this.productsService.updateProductForm(this.idProduct, event).subscribe((response) => {
      this.router.navigate([
        `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SELLING}`
      ]);
      this.productsService.products = [];
      this.changeDetectorRef.markForCheck();
    },
      (error) => {
        console.log(error);
      }
    );
  }

}
