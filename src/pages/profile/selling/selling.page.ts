import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { ProductInterface } from '../../../commons/interfaces/product.interface';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'selling',
  templateUrl: './selling.page.html',
  styleUrls: ['./selling.page.scss']
})
export class SellingPage implements OnInit {
  public products: Array<ProductInterface> = [];
  public userEdit: any;
  private filterProduct: any;
  public isSpinnerShow = true;
  constructor(private productsService: ProductsService, private userService: UserService) { }

  ngOnInit() {
    this.getInfoUser();
  }

  async getInfoUser() {
    this.userEdit = await this.userService.getInfoUser();
    this.filterProduct = {
      'filter[staged]': 'selling',
      'page[number]': '1',
      'page[size]': '100'
    };
    this.getProducts(this.filterProduct);
  }

  async getProducts(filter) {
    this.productsService.getProducts(filter).then(products => {
        this.products = [].concat(products);
        this.isSpinnerShow = false;
    });
  }


}
