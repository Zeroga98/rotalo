import { ProductsService } from './../../services/products.service';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BuyService } from '../../services/buy.service';

@Component({
  selector: "buy-product",
  templateUrl: "./buy-product.page.html",
  styleUrls: ["./buy-product.page.scss"]
})
export class BuyProductPage implements OnInit {
  @ViewChild("selectMedium", { read: ElementRef })
  selectMedium: ElementRef;
  idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ""));
  transactionSuccess: boolean = false;
  product: ProductInterface;
  payWithBank: boolean;

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private buyService: BuyService
  ) {}

  ngOnInit() {
    this.loadProduct();
  }
  goToUrlBank(): void {
    window.open('https://sucursalpersonas.transaccionesbancolombia.com', '_blank');
  }
  async loadProduct() {
    try {
      this.product = await this.productsService.getProductsById(this.idProduct);
    } catch (error) {}
  }

  async buyProduct() {
    try {
      if (!this.payWithBank) {
        const response = await this.buyService.buyProduct(this.buildParams());
        this.transactionSuccess = true;
       } else {
        this.goToUrlBank();
       }
    } catch (error) {}
  }

  private buildParams() {
    return {
      "product-id": this.idProduct,
      "payment-type": this.selectMedium.nativeElement.value
    };
  }

  selectedMedium(): void {
    if (this.selectMedium.nativeElement.value === "bank_account_transfer") {
      this.payWithBank = true;
    }else {
      this.payWithBank =  false;
    }
  }

  checkSufiBotton() {
    if (this.product['type-vehicle'] && this.product['model']) {
      const type =  this.product['type-vehicle'];
      const currentYear = (new Date()).getFullYear() + 1;
      const modelo = this.product['model'];
      const differenceYear = currentYear - modelo;
      if (this.product.subcategory.id === "9" && differenceYear <= 10 && type === "Particular") {
        return true;
      }
    }
    return false;
  }

}
