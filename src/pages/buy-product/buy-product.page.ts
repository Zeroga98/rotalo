import { ChangeDetectorRef } from '@angular/core';
import { ProductsService } from './../../services/products.service';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { BuyService } from '../../services/buy.service';
import { CurrentSessionService } from '../../services/current-session.service';
<<<<<<< HEAD
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
=======
import { ROUTES } from '../../router/routes';
>>>>>>> 036811dfb8cb0eaf3650ee73680a01f32312af2a

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
  categoryProduct: String;
  subCategoryProduct: String;
  usedProduct: String;
  photoProduct: String;
  priceProduct;
  pricePayment = 0;
  priceDelivery = 0;
  private idNumberSeller;
  private currentUser;
  private cellphoneUser;
  buyForm: FormGroup;

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private userService: UserService,
    private buyService: BuyService,
    private currentSessionSevice: CurrentSessionService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buyForm = this.fb.group({
      'payment-type': ['bank_account_transfer', Validators.required],
    });
    this.buyForm.get('payment-type').valueChanges.subscribe(value => this.selectedMedium(value));
    this.loadProduct();
  }
  goToUrlBank(): void {
    window.open('https://sucursalpersonas.transaccionesbancolombia.com', '_blank');
  }

  vaproductIsFree() {
   return this.product && this.product['sell-type'] === 'GRATIS' || this.product.price === 0;
  }

  initFormBuy() {
    if (this.vaproductIsFree()) {
      this.buyForm.patchValue({
        'payment-type': 'na'
      });
    }else {
      this.buyForm.patchValue({
        'payment-type': 'bank_account_transfer'
      });
      this.payWithBank = true;
    }
  }

  async loadProduct() {
    try {
      this.product = await this.productsService.getProductsById(this.idProduct);
      this.currentUser = await this.userService.getInfoUser();
      this.cellphoneUser =  this.currentUser.cellphone;
      this.categoryProduct = this.product.subcategory.category.name;
      this.subCategoryProduct = this.product.subcategory.name;
      this.priceProduct = this.product.price;
      this.product.used ? (this.usedProduct = "Usado") : (this.usedProduct = "Nuevo");
      this.photoProduct = this.product.photos.url || this.product.photos[0].url;
      this.idNumberSeller = this.product.user['id-number'];
      this.initFormBuy();
      this.changeDetectorRef.markForCheck();
    } catch (error) {}
  }

  async buyProduct() {
    try {
      const response = await this.buyService.buyProduct(this.buildParams());
      this.transactionSuccess = true;
      if (this.payWithBank) {
        this.goToUrlBank();
       }
       this.changeDetectorRef.markForCheck();
    } catch (error) {}
  }

  async buyWithNequi() {
    try {
      const response = await this.buyService.buyProductNequi(this.buildParamsNequi());
       this.changeDetectorRef.markForCheck();
    } catch (error) {}
  }

  private buildParamsNequi() {
    return {
      numeroCelular: this.cellphoneUser,
      idVendedor: this.idNumberSeller,
      valorPagar: this.priceProduct,
      idProducto: this.idProduct
      };
  }

  private buildParams() {
    return {
      "product-id": this.idProduct,
      "payment-type": this.buyForm.get('payment-type').value
    };
  }

  selectedMedium(valueMedium): void {
    if (valueMedium === "bank_account_transfer") {
      this.payWithBank = true;
    }else {
      this.payWithBank =  false;
    }
  }

  goBack(): void {
        window.history.back();
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

  openSimulateCreditSufi(id: number | string) {
    const urlSimulateCredit = `${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.SIMULATECREDIT
    }/${id}`;
    this.router.navigate([urlSimulateCredit]);
  }

}
