import {
    Component,
    OnInit, Input, Output, EventEmitter
  } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../../router/routes';

  @Component({
    selector: 'app-modal-detail',
    templateUrl: 'modal-detail.component.html',
    styleUrls: ['modal-detail.component.scss']
  })
  export class ModalDetailComponent implements OnInit {

    @Input() product;
    @Output() closeModal = new EventEmitter();
    public productPhoto: any;

    ngOnInit() {
      this.productPhoto = this.product.photos[0].url;
    }

    constructor(
      private router: Router
    ) {}

    goToMicrositeFeed() {
      this.router.navigate([
        `/${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.FEED}`
      ]);
    }

    goToShoppingCart() {
      this.router.navigate([
        `/${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.CAR}`
      ]);
    }

    closeModalBuy() {
      this.closeModal.emit();
    }
  }
