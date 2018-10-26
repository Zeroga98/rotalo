import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductInterface } from '../../commons/interfaces/product.interface';
import { ROUTES } from '../../router/routes';
import { ProductsService } from '../../services/products.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'financeBam',
  templateUrl: './financeBam.component.html',
  styleUrls: ['./financeBam.component.scss']
})
export class FinanceBamComponent implements OnInit {
  public idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ''));
  public product: ProductInterface;
  private currentUser;
  public nameUser;
  public typeDocument;
  public documentNumber;
  public email;
  public cellphone;
  public photoProduct: String;
  public priceProduct;

  constructor(private router: Router,
    private productsService: ProductsService,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    this.loadProduct();
  }

  async loadProduct() {
    try {
      this.product = await this.productsService.getProductsById(this.idProduct);
      console.log(this.product);
      if (this.product.photos) {
        this.photoProduct = this.product.photos.url || this.product.photos[0].url;
      }
      this.priceProduct = this.product.price;
      this.currentUser = await this.userService.getInfoUser();
      this.nameUser = this.currentUser.name;
      this.typeDocument = 'DPI';
      this.documentNumber = this.currentUser['id-number'];
      this.email = this.currentUser.email;
      this.cellphone = this.currentUser.cellphone;
      this.changeDetectorRef.markForCheck();
      console.log(this.currentUser);
    } catch (error) {
      if (error.status === 404) {
        this.redirectErrorPage();
      }
    }
  }

  redirectErrorPage() {
    this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.ERROR}`]);
  }

}
