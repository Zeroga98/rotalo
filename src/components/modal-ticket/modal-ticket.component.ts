import { Component, OnInit, OnDestroy, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { CurrentSessionService } from '../../services/current-session.service';
import { ModalTicketService } from './modal-ticket.service';
import { FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service';

function isEmailOwner( c: AbstractControl ): { [key: string]: boolean } | null {
  const email = c;
  if (email.value == this.currentEmail) {
    return { emailError: true };
  }
  return null;
}


@Component({
  selector: 'modal-ticket',
  templateUrl: './modal-ticket.component.html',
  styleUrls: ['./modal-ticket.component.scss']
})
export class ModalTicketComponent implements OnInit, OnDestroy {

  @Input() id: string;
  @Input() coupon;
  private currentEmail;
  private element: any;
  private productId;
  public sendEmail;
  public messageSuccess: boolean;
  public messageError: boolean;
  public textError: boolean;

  constructor(private modalService: ModalTicketService,
    private el: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private currentSessionSevice: CurrentSessionService) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    const modal = this;
    const currentUser = this.currentSessionSevice.currentUser();
    if (currentUser) {
      this.currentEmail = currentUser.email;
      const emailObject = {
        'correo' : this.currentEmail
      };
    }

    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    document.body.appendChild(this.element);
    this.modalService.add(this);
    this.initShareForm();
  }

  ngOnDestroy() {
    this.close();
    this.modalService.remove(this.id);
    this.modalService.setProductId(undefined);
    this.element = undefined;
  }

  initShareForm() {
    this.sendEmail = this.fb.group(
      {
        email: ['', [Validators.required , isEmailOwner.bind(this) , Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]]
      }
    );
  }

  shareEmail() {
    if (!this.sendEmail.invalid) {
      const params = {
        correo: this.sendEmail.get('email').value
      };
      this.productsService
        .shareCoupon(params)
        .then(response => {
          this.sendEmail.reset();

          if (response.status == '501') {
            this.messageError = true;
          } else {
            this.messageSuccess = true;
          }

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

  open(): void {
    this.productId = this.modalService.getProductId();
    this.element.classList.add('md-show');
    document.body.classList.add('modal-open-red');
  }

  close(): void {
    this.modalService.setProductId(undefined);
    this.element.classList.remove('md-show');
    document.body.classList.remove('modal-open-red');
  }


}
