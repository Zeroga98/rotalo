import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';
import { ShoppingCarService } from '../../services-microsite/front/shopping-car.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../../router/routes';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FeedMicrositeService } from '../products-microsite/feedMicrosite.service';
import { ProductsMicrositeService } from '../../services-microsite/back/products-microsite.service'

@Component({
  selector: 'car-microsite',
  templateUrl: 'car-microsite.page.html',
  styleUrls: ['car-microsite.page.scss']
})
export class CarMicrositePage implements OnInit {

  public products: Array<any>
  public errorsSubmit: Array<any> = [];
  public currentUser;
  public nameUser;
  public typeDocument;
  public documentNumber;
  public userId;
  public email;
  public cellphone;
  public country;
  public city;
  public state;
  public errorMessage = '';
  public errorState = false;
  public errorCity = false;
  public carTotalPrice = 0;
  public carSubTotalPrice = 0;
  public carTotalIva = 0;
  private currentFilter: Object;
  showView: string;

  showForm: boolean;
  showInfo: boolean;
  canHide: boolean;
  viewWidth: number;

  public registerForm: FormGroup;

  constructor(
    private car: ShoppingCarService,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private feedService: FeedMicrositeService,
    private back: ProductsMicrositeService
  ) {
    this.currentFilter = this.feedService.getCurrentFilter();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setWidthParams();
  }

  ngOnInit() {
    this.products = this.car.getProducts();
    this.getCarTotalPrice();

    this.setCountry();
    this.initForm();
    this.loadUserInfo();
    this.loadProducts();
    this.setWidthParams();
  }

  getDocument(id) {
    switch (id) {
      case 1: {
        this.typeDocument = "CC"
        break;
      }
      case 4: {
        this.typeDocument = "CE"
        break;
      }
      case 5: {
        this.typeDocument = "PA"
        break;
      }
      case 6: {
        this.typeDocument = "CIP"
        break;
      }
      case 7: {
        this.typeDocument = "DPI"
        break;
      }
      default:
        break;
    }

    return this.typeDocument;
  }

  async loadUserInfo() {
    try {
      this.currentUser = await this.userService.getInfoUser();
      this.nameUser = this.currentUser.name;
      this.typeDocument = this.getDocument(this.currentUser['type-document-id']);
      this.documentNumber = this.currentUser['id-number'];
      this.userId = this.currentUser.id;
      this.email = this.currentUser.email;
      this.cellphone = this.currentUser.cellphone;
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      if (error.status === 404) {
        this.redirectErrorPage();
      }
    }
  }

  redirectErrorPage() {
    this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.ERROR}`]);
  }

  initForm() {
    this.registerForm = new FormGroup({
      address: new FormControl('', [Validators.required]),
      cellphone: new FormControl('', [Validators.required])
    });
  }

  setCountry() {
    this.country = {
      name: 'Colombia',
      id: '1'
    };
  }

  async onSubmit() {
    if (!this.formIsInvalid) {
      const params = this.buildParamsUserRequest();
      this.userService.signup(params).subscribe(
        response => {
          this.errorsSubmit = [];
          this.errorMessage = '';
        },
        error => {
          if (error.status) {
            console.log(error.status);
            this.errorMessage = error.error.message;
          }
        }
      );
    } else {
      this.validateAllFormFields(this.registerForm);
      if (this.state && !this.state['id']) {
        this.errorState = true;
      }
      if (this.state && !this.city['id']) {
        this.errorCity = true;
      }
    }
  }

  get formIsInvalid(): boolean {
    return this.registerForm.invalid || !this.selectIsCompleted();
  }

  private selectIsCompleted(): boolean {
    if (this.country && this.state && this.city) {
      if (this.country['id'] && this.state['id'] && this.city['id']) {
        return true;
      }
    }
    return false;
  }

  buildParamsUserRequest() {
    const params = {
      'idPais': this.country['id'],
      'idDepartamento': this.state['id'],
      'idCiudad': this.city['id'],
      'direccion': this.registerForm.get('address').value,
      'celular': this.registerForm.get('cellphone').value
    };
    return params;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  validateState() {
    if (this.state && this.state['id']) {
      this.errorState = false;
    }
  }

  validateCity() {
    if (this.state && this.city['id']) {
      this.errorCity = false;
    }
  }

  getCarTotalPrice() {
    this.carTotalPrice = 0;
    this.products.forEach(element => {
      this.carTotalPrice += element.quantity * element.product.price;
    });
    this.carTotalIva = Math.round(this.carTotalPrice - (this.carTotalPrice / 1.19));
    this.carSubTotalPrice = this.carTotalPrice - this.carTotalIva;
  }

  goToMicrosite() {
    this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.FEED}`]);
  }

  changeQuantity(stock: number, product) {
    this.car.updateProductQuantity(product.id, stock);
    this.products = this.car.getProducts();
    this.getCarTotalPrice();
  }

  setWidthParams() {
    this.viewWidth = window.innerWidth;
    if (this.viewWidth > 975) {
      this.showForm = true;
      this.showInfo = true;
      this.canHide = false;
    } else {
      this.showForm = true;
      this.showInfo = false;
      this.canHide = true;
    }
  }

  hideFormText() {
    if (this.canHide) {
      this.showForm = !this.showForm;
    }
  }

  hideInfoText() {
    if (this.canHide) {
      this.showInfo = !this.showInfo;
    }
  }

  async loadProducts() {
    this.showView = "loading";
    const params = this.getParamsToProducts();
    try {
      var response = await this.back.getCarProducts(params);
      this.products = [];
      response.carroCompras.commerceItems.forEach(element => {
        this.products.push(element);        
      });
      this.car.setProducts(this.products);
      this.products = this.car.getProducts();

      if (this.products.length == 0) {
        this.showView = "noProducts";
      } else {
        this.showView = "Products";
      }

      this.getCarTotalPrice();
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      this.changeDetectorRef.markForCheck();
    }
    this.changeDetectorRef.markForCheck();
  }

  async deleteCheckedProducts() {
    const params = this.getParamsToProducts();
    try {
      console.log(this.car.getCheckedProducts());
      
      var response = await this.back.deleteProductToBD(this.car.getCheckedProducts(), params);
      this.car.initCheckedList();
      this.loadProducts();
      
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      this.changeDetectorRef.markForCheck();
    }
    this.changeDetectorRef.markForCheck();
  }

  getParamsToProducts() {
    return this.currentFilter;
  }

  pay() {
    let publicKey = 'pub_test_CYgwfGUNiOxIWh4WRJnfOsCu4FIxhy8p';
    let privateKey = 'prv_test_jAK3LXACf8ewSNJmhW86aa9I2b1NX3fb';
    let uniqueReference = 'asdf456468342384562';
    let redirectUrl = 'http://facebook.com';
    let currency = 'COP';
    let amount = '50000'; 
    
    let checkout = new WayboxCheckout({
      currency: currency,
        amountInCents: amount,
        reference: uniqueReference,
        publicKey: publicKey,
        redirectUrl: redirectUrl
    })

    checkout.open(() => {});
  }
}