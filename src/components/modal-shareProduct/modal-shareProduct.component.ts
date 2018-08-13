import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { ModalShareProductService } from './modal-shareProduct.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'modal-shareProduct',
  templateUrl: './modal-shareProduct.component.html',
  styleUrls: ['./modal-shareProduct.component.scss']
})
export class ModalShareProductComponent implements OnInit, OnDestroy {
  @Input() id: string;
  public sendInfoProduct;
  public messageSuccess: boolean;
  public messageError: boolean;
  public textError: boolean;
  private element: any;

  constructor(private modalService: ModalShareProductService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    const modal = this;

    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    document.body.appendChild(this.element);
    this.modalService.add(this);
    this.initShareForm();
  }

  initShareForm() {
    this.sendInfoProduct = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)])
    });
  }

  shareProduct() {
    if (!this.sendInfoProduct.invalid) {
      const params = {
        correo: this.sendInfoProduct.get('email').value
      };
    }
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }


  open(): void {
     this.element.classList.add('md-show');
     document.body.classList.add('modal-open');
   }

   close(): void {
     this.element.classList.remove('md-show');
     document.body.classList.remove('modal-open');
   }

}
