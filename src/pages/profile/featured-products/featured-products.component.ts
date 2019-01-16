import { Component, OnInit } from '@angular/core';
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
    private productsService: ProductsService,
    private router: Router) { }

  ngOnInit() {
    this.loadProducts();
  }

  selectProduct(product: ProductInterface) {
    const routeDetailProduct = `${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.SHOW
      }/${product['product_id']}`;
    this.router.navigate([routeDetailProduct]);
  }

  async loadProducts() {
    try {
      this.products = await this.productsService.loadFeaturedSelectedProducts();
    } catch (error) {
      console.log(error);
    }

  }

}
