import { Component, OnInit, HostListener, ElementRef, Input, OnDestroy } from '@angular/core';
import { ModalPromoProductService } from './modal-promoProduct.service';
import { ProductsService } from '../../services/products.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../router/routes';

@Component({
  selector: 'modal-promo',
  templateUrl: './modal-promo.component.html',
  styleUrls: ['./modal-promo.component.scss']
})
export class ModalPromoComponent implements OnInit , OnDestroy{
  @Input() id: string;
  private element: any;


  @HostListener('document:click', ['$event']) clickout(event) {
    if (event.target && event.target.className) {
      if (event.target.className == 'md-overlay') {
        this.close();
      }
    }
  }


  constructor(private modalService: ModalPromoProductService,
    private el: ElementRef,
    private currentSessionSevice: CurrentSessionService) {
      this.element = el.nativeElement;
    }

  ngOnInit() {
    const modal = this;
    const currentUser = this.currentSessionSevice.currentUser();
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    this.close();
    this.modalService.remove(this.id);
    this.element = undefined;
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
