import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ROUTES } from '../../../router/routes';
import { Router } from '@angular/router';
import { ProductInterface } from '../../../commons/interfaces/product.interface';
import { ProductsService } from '../../../services/products.service';
import { UtilsService } from '../../../util/utils.service';

@Component({
  selector: 'featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {
  public products: Array<ProductInterface> = [];
  constructor(
    private utilsService: UtilsService,
    private changeDetectorRef: ChangeDetectorRef,
    private productsService: ProductsService,
    private router: Router) { }
    public showEmpty;
    public errorChange;
    public successChange;

  ngOnInit() {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.productsService.setCheckedProductArray([]);
  }

  async loadProducts() {
    try {
      this.productsService.setCheckedProductArray([]);
      this.products  = await this.productsService.loadFeaturedSelectedProducts();
      const paramsProduct = this.products;
      paramsProduct.map((product, index) => {
        const newParam = {
          'productId': product['product_id'],
          'posicion':  index + 1
        };
        this.productsService.addCheckedProductArray(newParam);
        return newParam;
      });
      console.log(this.productsService.getCheckedProductArray());
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

  async  saveOrder() {
    try {
      this.errorChange = '';
      this.successChange = false;
      await this.productsService.reOrderProductChecked(this.productsService.getCheckedProductArray());
      this.loadProducts();
      this.successChange = true;
      this.utilsService.goToTopWindow(20, 600);
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      console.log(error);
      this.errorChange = error.error.message;
      this.utilsService.goToTopWindow(20, 600);
      this.changeDetectorRef.markForCheck();
    }
  }

}
