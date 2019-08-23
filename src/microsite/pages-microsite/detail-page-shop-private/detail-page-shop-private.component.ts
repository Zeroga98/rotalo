import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'detail-page-shop-private',
  templateUrl: './detail-page-shop-private.component.html',
  styleUrls: ['./detail-page-shop-private.component.scss']
})
export class DetailPageShopPrivateComponent implements OnInit {
  idProduct: number = parseInt(this.router.url.split('?', 2)[0].replace(/[^\d]/g, ''));
  codeProduct = this.router.url.split('code=', 2)[1];
  isDetailReadOnly: boolean = false;
  isSpinnerShow = true;
  isFooterShow = false;
  constructor(private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private activedRoute: ActivatedRoute,
    private productsService: ProductsService) { }

    ngOnInit() {
      this.activedRoute.params.subscribe(params => {
        this.isDetailReadOnly = params.readOnly || false;
      });
      this.isSpinnerShow = false;
      this.sendTokenShareProduct();
    }

    onNotify(product): void {
      this.showFooter(product);
    }

    showFooter(product) {
      if (product) {
        this.isFooterShow = true;
      } else {
        this.isFooterShow = false;
      }
    }

    sendTokenShareProduct() {
      if (this.codeProduct && this.codeProduct !== 'na') {
        this.productsService.sendTokenShareProduct(this.codeProduct).subscribe((response) => {
          if (response.status == 0) {
            this.productsService.setUrlDetailProduct(undefined);
          }
        }, (error) => {console.log(error); });
      }
    }

}