import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductInterface } from '../../commons/interfaces/product.interface';
import { ROUTES } from '../../router/routes';
import { ProductsService } from '../../services/products.service';
import { UserService } from '../../services/user.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'financeBam',
  templateUrl: './financeBam.component.html',
  styleUrls: ['./financeBam.component.scss']
})
export class FinanceBamComponent implements OnInit {
  public idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ''));
  public product;
  private currentUser;
  public nameUser;
  public typeDocument;
  public documentNumber;
  public email;
  public cellphone;
  public photoProduct: String;
  public priceProduct ;
  public sendInfoPrice;
  private usarId;
  public successMessage = false;

  constructor(private router: Router,
    private productsService: ProductsService,
    private userService: UserService,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    this.loadProduct();
    this.initPriceForm();
  }

  async loadProduct() {
    this.currentUser = await this.userService.getInfoUser();
    this.productsService.getProductsByIdDetail(this.idProduct).subscribe((response) => {
      if (response.body) {
        this.product = response.body.productos[0];
        if (this.product.photoList) {
          this.photoProduct = this.product.photoList.url || this.product.photoList[0].url;
        }
        this.priceProduct = this.product.price;
        this.nameUser = this.currentUser.name;
        this.typeDocument = 'DPI';
        this.documentNumber = this.currentUser['id-number'];
        this.usarId = this.currentUser.id;
        this.email = this.currentUser.email;
        this.cellphone = this.currentUser.cellphone;
        const price = this.sendInfoPrice.get('price');
        price.clearValidators();
        price.setValidators([Validators.required, Validators.min(1) , Validators.max(this.priceProduct)]);
        price.updateValueAndValidity();
      }
        this.changeDetectorRef.markForCheck();
      }, (error) => {
        if (error.status === 404) {
          this.redirectErrorPage();
        }
      });

  }

  redirectErrorPage() {
    this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.ERROR}`]);
  }

  initPriceForm() {
    this.sendInfoPrice = this.fb.group(
      {
        price: ['', [Validators.required]]
      }
    );
  }

  financeProduct() {
    if (!this.sendInfoPrice.invalid) {
      const params = {
        'userId': this.usarId,
        'productId': this.idProduct,
        'creditValue': this.sendInfoPrice.get('price').value
      };
      this.productsService.creditBAM(params).subscribe((response) => {
        this.successMessage = true;
        this.gapush(
          'send',
          'event',
          'Productos',
          'ClicFinanciacion',
          'EnviarExitoso'
        );
        this.changeDetectorRef.markForCheck();
      },
      (error) => {
        console.log(error);
      });
    } else {
      this.validateAllFormFields(this.sendInfoPrice);
      this.changeDetectorRef.markForCheck();
    }
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

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

}
