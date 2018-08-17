import { Component, OnInit, Input, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ModalUploadProductService } from './modal-uploadProduct.service';
import { ProductsService } from '../../services/products.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../router/routes';

function isEmailOwner( c: AbstractControl ): { [key: string]: boolean } | null {
  const email = c;
  if (email.value == this.currentEmail) {
    return { emailError: true };
  }
  return null;
}

@Component({
  selector: 'modal-uploadProduct',
  templateUrl: './modal-uploadProduct.component.html',
  styleUrls: ['./modal-uploadProduct.component.scss']
})
export class ModalUploadProductComponent implements OnInit, OnDestroy {

  @Input() id: string;
  public sendInfoProduct;
  public messageSuccess: boolean;
  public messageError: boolean;
  public textError: boolean;
  private element: any;
  private productId;
  private currentEmail;

  constructor(private modalService: ModalUploadProductService,
    private el: ElementRef,
    private productsService: ProductsService,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private currentSessionSevice: CurrentSessionService,
    private router: Router) {
      this.element = el.nativeElement;
    }

  ngOnInit() {
    const modal = this;
    const currentUser = this.currentSessionSevice.currentUser();
    if(currentUser) {
      this.currentEmail = currentUser.email;
    }
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    document.body.appendChild(this.element);
    this.modalService.add(this);
    this.initShareForm();
  }

  initShareForm() {
    this.sendInfoProduct = this.fb.group(
      {
        email: ['', [Validators.required , isEmailOwner.bind(this) , Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]]
      }
    );
  }

  shareProduct() {
    if (!this.sendInfoProduct.invalid && this.productId) {
      const params = {
        correo: this.sendInfoProduct.get('email').value
      };
      this.productsService
        .shareProduct(params, this.productId)
        .then(response => {
          this.sendInfoProduct.reset();
          this.messageSuccess = true;
          this.changeDetectorRef.markForCheck();
        })
        .catch(httpErrorResponse => {
          if (httpErrorResponse.status === 422) {
            this.textError = httpErrorResponse.error.errors[0].detail;
            this.messageError = true;
            this.changeDetectorRef.markForCheck();
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.close();
    this.modalService.remove(this.id);
    this.modalService.setProductId(undefined);
    this.element = undefined;
    //this.element.remove();
  }

  open(): void {
    this.productId = this.modalService.getProductId();
    this.element.classList.add('md-show');
    document.body.classList.add('modal-open');
  }

  close(): void {
    this.sendInfoProduct.reset();
    this.messageSuccess = false;
    this.messageError = false;
    this.element.classList.remove('md-show');
    document.body.classList.remove('modal-open');
    const id = this.modalService.getProductId();
    if (id) {
      this.router.navigate([
        `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${id}`
      ]);
    }
    this.modalService.setProductId(undefined);
  }

}
