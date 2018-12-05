import { ChangeDetectorRef } from '@angular/core';
import { ProductsService } from './../../services/products.service';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import { Router } from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { BuyService } from '../../services/buy.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ROUTES } from '../../router/routes';
import { NavigationService } from '../products/navigation.service';


@Component({
  selector: 'buy-product',
  templateUrl: './buy-product.page.html',
  styleUrls: ['./buy-product.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuyProductPage implements OnInit {
  @ViewChild('selectMedium', { read: ElementRef })
  selectMedium: ElementRef;
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
  private idUserSellerDb;
  private currencyProduct;
  private currentUser;
  private cellphoneUser;
  private idNumberBuyer;
  buyForm: FormGroup;
  payMethod: String = 'bank_account_transfer';
  confirmPurchase: boolean = false;
  showInfoPage: boolean = false;
  titlePurchase: String = 'Comprar';
  selectOptionsPageInfo: String = 'error';
  public isModalBuyShowed: boolean = false;
  private observableCheckState;
  private tokenUser;
  private timeToWaitPay = 4;
  public disableButton = false;
  public idCountry = 1;
  public quantityForm;
  public totalStock = 1;
  public totalPrice;
  public quantity = 1;
  public errorMessage = '';
  constructor(
    private router: Router,
    private productsService: ProductsService,
    private userService: UserService,
    private buyService: BuyService,
    private currentSessionSevice: CurrentSessionService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private navigationService: NavigationService,
  ) {
    let countryId;
    if (this.navigationService.getCurrentCountryId()) {
      countryId = this.navigationService.getCurrentCountryId();
    }else {
      countryId = this.currentSessionSevice.currentUser()['countryId'];
    }
    this.idCountry = countryId;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    this.buyForm = this.fb.group({
      'payment-type': ['bank_account_transfer', Validators.required]
    });
    this.buyForm.get('payment-type').valueChanges.subscribe(value => {
      this.payMethod = value;
      this.selectedMedium(value);
    });
    this.tokenUser = this.currentSessionSevice.authToken();
    this.loadProduct();
    this.errorMessage = '';
    this.changeDetectorRef.markForCheck();
  }

  initQuantityForm() {
    const quantityObject = this.buyService.getQuantityProduct();
    this.quantity = 1;
    if (quantityObject && quantityObject.idProduct == this.idProduct) {
      this.quantity = quantityObject.quantity;
    }
    this.quantityForm = this.fb.group(
      {
        stock: [this.quantity, [Validators.required, Validators.min(1), Validators.max(1)]]
      }
    );
  }

  goToUrlBank(): void {
    window.open(
      'https://sucursalpersonas.transaccionesbancolombia.com',
      '_blank'
    );
  }

  vaproductIsFree() {
    return (
      (this.product && this.product['sell-type'] === 'GRATIS') ||
      this.product.price === 0
    );
  }

  initFormBuy() {
    if (this.vaproductIsFree()) {
      this.buyForm.patchValue({
        'payment-type': 'na'
      });
    } else {
      this.buyForm.patchValue({
        'payment-type': 'cash'
      });
    }
  }

   loadProduct() {
    this.productsService.getProductsByIdDetail(this.idProduct).subscribe((reponse) => {
      if (reponse.body) {
        this.loadUserInfo(reponse);
      }
    } ,
    (error) => {
      console.log(error);
    });
  }

  async loadUserInfo(reponse) {
    try {
      this.initQuantityForm();
      this.product = reponse.body.productos[0];
      if (this.product.status && this.product.status !=  'expired') {
        this.currentUser = await this.userService.getInfoUser();
        this.cellphoneUser = this.currentUser.cellphone;
        this.idNumberBuyer = this.currentUser['id-number'];
        if (this.product.subcategory && this.product.subcategory.category) {
          this.subCategoryProduct = this.product.subcategory.name;
          this.categoryProduct = this.product.subcategory.category.name;
        }
        this.priceProduct = this.product.price;
        if (this.product['stock']) {
          this.totalStock = this.product['stock'];
        } else  {
          this.totalStock = 1;
        }

        const price = this.quantityForm.get('stock');
        price.clearValidators();
        price.setValidators([Validators.required, Validators.min(1), Validators.max(this.totalStock)]);
        price.updateValueAndValidity();


        if (this.quantityForm.get('stock').value) {
          const quantity = this.quantityForm.get('stock').value;
          this.totalPrice =  this.priceProduct * quantity;
        } else {
          this.totalPrice = this.priceProduct;
        }
        this.product.used
          ? (this.usedProduct = 'Usado')
          : (this.usedProduct = 'Nuevo');
        if (this.product['photoList']) {
          this.photoProduct = this.product['photoList'].url || this.product['photoList'][0].url;
        }
        this.idNumberSeller = this.product.user['id-number'];
        this.idUserSellerDb = this.product.user['id'];
        this.currencyProduct = this.product.currency;
        this.initFormBuy();
        this.changeDetectorRef.markForCheck();
      } else  {
        this.redirectErrorPage();
      }
    } catch (error) {
      if (error.status === 404) {
        this.redirectErrorPage();
      }
    }
  }

  productIsSold(product) {
    if (product.status && product.status === 'sold') {
      this.router.navigate([
        `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
      ]);
    }
  }

  redirectErrorPage() {
    this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.ERROR}`]);
  }

  async buyProduct() {
    try {
      this.product = await this.productsService.getProductsById(this.idProduct);
      window.scrollTo(0, 0);
      if (this.product.status !== 'sell_process') {
        if (this.payMethod !== 'nequi') {
          const response = await this.buyService.buyProduct(this.buildParams());
          this.transactionSuccess = true;
          if (this.payWithBank) {
            this.goToUrlBank();
          }
          this.changeDetectorRef.markForCheck();
        } else {
          this.buyWithNequi();
        }
      } else {
        this.isModalBuyShowed = true;
        this.changeDetectorRef.markForCheck();
      }
    } catch (error) {
      if (error.status === 404) {
        this.redirectErrorPage();
      }
    }
  }

  buyProductCash() {
    // this.disableButton = true;
    if (!this.formIsInValid) {
      this.buyService.buyProduct(this.buildParams()).subscribe((response) => {
        this.transactionSuccess = true;
        this.productsService.scroll = undefined;
        this.changeDetectorRef.markForCheck();
      },
      (error) => {
        if (error.error) {
          if (error.error.status == '404') {
            this.disableButton = false;
            this.redirectErrorPage();
          } else {
            this.errorMessage = '';
            this.errorMessage = error.error.message;
          }
          this.changeDetectorRef.markForCheck();
        } else {
          this.disableButton = false;
          this.redirectErrorPage();
        }
      });
    }

  }

  showMessageModal(evt) {
    this.isModalBuyShowed = evt.isModalBuyShowed;
  }

  buyWithNequi() {
    this.buyService.buyProductNequi(this.buildParamsNequi()).subscribe(
      response => {
        if (response.status === '0') {
          this.confirmPurchase = true;
          this.titlePurchase = 'Confirmar tu compra';
          const params = {
            numeroCelular: this.cellphoneUser,
            idTransaccion: response.body.idTransaccion,
            idProducto: this.idProduct
          };
          this.observableCheckState = this.buyService
            .validateStateNequi(params)
            .subscribe(
              state => {
                this.titlePurchase = 'Resumen de compra';
                if (state.status === '0') {
                  this.selectInfoPage(state.body.estadoPago);
                } else {
                  this.selectInfoPage(-1);
                }
              },
              error => console.log(error)
            );
        } else {
          this.titlePurchase = 'Resumen de compra';
          this.selectInfoPage(-1);
          this.showInfoPage = true;
        }
        this.changeDetectorRef.markForCheck();
      },
      error => {
        this.titlePurchase = 'Resumen de compra';
        this.selectInfoPage(-1);
        this.showInfoPage = true;
        this.changeDetectorRef.markForCheck();
      }
    );
  }

  private selectInfoPage(option) {
    switch (option) {
      case 1:
        this.selectOptionsPageInfo = 'success';
        break;
      case -1:
        this.selectOptionsPageInfo = 'error';
        break;
      case -2:
        this.selectOptionsPageInfo = 'expire';
        break;
      default:
        this.selectOptionsPageInfo = 'error';
        break;
    }
    this.confirmPurchase = false;
    this.showInfoPage = true;
  }

  /**CONSULTAR TIPO DE DOCUMENTO**/
  private buildParamsNequi() {
    return {
      numeroCelular: this.cellphoneUser,
      idUsuarioVendedor: this.idUserSellerDb,
      tipoIdVendedor: 'cc',
      idVendedor: '1',
      idComprador: this.idNumberBuyer,
      // idVendedor: this.idNumberSeller,
      tipoMoneda: this.currencyProduct,
      valorPagar: this.priceProduct,
      idProducto: this.idProduct
    };
  }

  private buildParams() {
    return {
      'idProducto': this.idProduct,
      'tipoPago': this.buyForm.get('payment-type').value,
      'cantidad': this.quantity
    };
  }

  selectedMedium(valueMedium): void {
    if (valueMedium === 'bank_account_transfer') {
      this.payWithBank = true;
    } else {
      this.payWithBank = false;
    }
  }

  goBack(): void {
    window.history.back();
  }

  checkSufiBotton() {
    if (this.product && this.product['type-vehicle'] && this.product['model']) {
      const currentUser = this.currentSessionSevice.currentUser();
      const priceVehicle = this.product.price;
      const countryId = Number(currentUser['countryId']);
      const type = this.product['type-vehicle'];
      const currentYear = new Date().getFullYear() + 1;
      const modelo = this.product['model'];
      const differenceYear = currentYear - modelo;
      if (
        this.product.subcategory.name === 'Carros' &&
        differenceYear <= 10 &&
        type === 'Particular' &&
        countryId === 1 &&
        priceVehicle >= this.minVehicleValue &&
        priceVehicle <= this.maxVehicleValue
      ) {
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


  get showOptionsVehicles() {
    if (this.product) {
      if (this.product.subcategory.category.id == 6) {
        if (this.product.subcategory.id != 11) {
          return false;
        }
      }
      return true;
    }
  }
  get showOptionEstate () {
    if (this.product) {
      if (this.product.subcategory.category.id == 7) {
        return false;
      }
    }
    return true;
  }


  addStock() {
    if (this.showOptionsVehicles &&  this.showOptionEstate) {
      if (this.quantityForm.get('stock').value < this.totalStock) {
        let stock =  this.quantityForm.get('stock').value;
        stock = ++stock;
        this.quantityForm.patchValue({stock: stock});
        if (this.quantityForm.get('stock').value) {
          const quantity = this.quantityForm.get('stock').value;
          this.quantity = quantity;
          this.totalPrice =  this.priceProduct * quantity;
        } else {
          this.totalPrice = this.priceProduct;
        }
      }
    }
  }

  minusStock() {
    if (this.showOptionsVehicles && this.showOptionEstate) {
      if (this.quantityForm.get('stock').value > 1) {
        let stock =  this.quantityForm.get('stock').value;
        stock = --stock;
        this.quantityForm.patchValue({stock: stock});
        if (this.quantityForm.get('stock').value) {
          const quantity = this.quantityForm.get('stock').value;
          this.quantity = quantity;
          this.totalPrice =  this.priceProduct * quantity;
        } else {
          this.totalPrice = this.priceProduct;
        }
      }
    }
  }

  get formIsInValid() {
    return this.quantityForm.invalid;
  }

  changeTotalValue() {
    if (this.quantityForm.get('stock').value && this.quantityForm.get('stock').valid) {
      const quantity = this.quantityForm.get('stock').value;
      this.quantity = quantity;
      this.totalPrice =  this.priceProduct * quantity;
    } else {
      this.totalPrice = this.priceProduct;
    }
  }


}
