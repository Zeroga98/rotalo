import { ChangeDetectorRef } from '@angular/core';
import { ProductsService } from './../../services/products.service';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { BuyService } from '../../services/buy.service';
import { CurrentSessionService } from '../../services/current-session.service';

@Component({
  selector: "buy-product",
  templateUrl: "./buy-product.page.html",
  styleUrls: ["./buy-product.page.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuyProductPage implements OnInit {
  @ViewChild('selectMedium', {read: ElementRef}) selectMedium: ElementRef;
  idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ''));
  transactionSuccess: boolean = false;
  product: ProductInterface;
  payWithBank: boolean;
  private minVehicleValue = 10000000;
  private maxVehicleValue = 5000000000;
  constructor(
    private router: Router,
    private productsService: ProductsService,
    private buyService: BuyService,
    private currentSessionSevice: CurrentSessionService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProduct();
  }
  goToUrlBank(): void {
    window.open('https://sucursalpersonas.transaccionesbancolombia.com', '_blank');
  }

  vaproductIsFree() {
   return this.product && this.product['sell-type'] === 'GRATIS';
  }

  async loadProduct() {
    try {
      this.product = await this.productsService.getProductsById(this.idProduct);
      this.changeDetectorRef.markForCheck();
    } catch (error) {}
  }

  async buyProduct() {
    try {
      if (!this.payWithBank) {
        const response = await this.buyService.buyProduct(this.buildParams());
        this.transactionSuccess = true;
        this.productsService.products = [];
        this.changeDetectorRef.markForCheck();
       } else {
        const response = await this.buyService.buyProduct(this.buildParams());
        this.goToUrlBank();
        this.transactionSuccess = true;
        this.productsService.products = [];
        this.changeDetectorRef.markForCheck();
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
    if (this.product && this.product["type-vehicle"] && this.product["model"]) {
      const currentUser = this.currentSessionSevice.currentUser();
      const priceVehicle = this.product.price;
      const countryId = Number(currentUser["countryId"]);
      const type = this.product["type-vehicle"];
      const currentYear = new Date().getFullYear() + 1;
      const modelo = this.product["model"];
      const differenceYear = currentYear - modelo;
      if (this.product.subcategory.name === "Carros" &&
       differenceYear <= 10 &&
       type === "Particular" &&
       countryId === 1 &&
       priceVehicle >=  this.minVehicleValue && priceVehicle <= this.maxVehicleValue) {
        return true;
      }
    }
    return false;
  }

}
