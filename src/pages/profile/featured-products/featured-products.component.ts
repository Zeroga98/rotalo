import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ROUTES } from '../../../router/routes';
import { Router } from '@angular/router';
import { ProductInterface } from '../../../commons/interfaces/product.interface';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent implements OnInit {
  public products: Array<ProductInterface> = [];
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private productsService: ProductsService,
    private router: Router) { }
    public showEmpty;

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    try {
      this.products = await this.productsService.loadFeaturedSelectedProducts();
      if (this.products.length == 0) {
        this.showEmpty = true;
      }
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      this.showEmpty = true;
      console.log(error);
      this.changeDetectorRef.markForCheck();
    }

  }

  updateProduct($event) {
    if ($event) {
      this.loadProducts();
    }
  }

  selectProduct(product: ProductInterface) {
    const routeDetailProduct = `${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.SHOW
      }/${product['product_id']}`;
    this.router.navigate([routeDetailProduct]);
  }

  saveOrder() {
    
  }

}
