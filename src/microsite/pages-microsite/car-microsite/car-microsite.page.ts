import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';
import { ShoppingCarService } from '../../services-microsite/front/shopping-car.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../../router/routes';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FeedMicrositeService } from '../products-microsite/feedMicrosite.service';
import { ProductsMicrositeService } from '../../services-microsite/back/products-microsite.service';
import { windowService } from '../../services-microsite/front/window.service';
import { CollectionSelectService } from '../../../services/collection-select.service';
declare var WidgetCheckout: any;

@Component({
  selector: 'car-microsite',
  templateUrl: 'car-microsite.page.html',
  styleUrls: ['car-microsite.page.scss']
})
export class CarMicrositePage implements OnInit, OnDestroy {

  public products: Array<any>;
  public errorsSubmit: Array<any> = [];
  public currentUser;
  public nameUser;
  public typeDocument;
  public documentNumber;
  public userId;
  public email;
  public cellphone;
  public country: Object = {};
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
  disablePayButton = false;

  productWithError = [];
  disabledButton;
  hasPending = false;
  emptyMessaje = false;
  hasANewQuantity = false;
  productsWithError = false;
  emptyCheck = false;
  nameProductError = '';
  errorPending = 'Actualmente tienes una transacción en proceso, si no has recibido la confirmación de tu pago, escríbenos a info@rotalo.com.co';
  public registerForm: FormGroup;
  public registerFormBank: FormGroup;
  public shippingTaxes;
  public classCheckSelected;

  constructor(
    private car: ShoppingCarService,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private feedService: FeedMicrositeService,
    private back: ProductsMicrositeService,
    private window: windowService,
    private collectionService: CollectionSelectService,
  ) {
    this.getCountries();
    this.currentFilter = this.feedService.getCurrentFilter();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setWidthParams();
  }

  ngOnInit() {
    this.products = this.car.getProducts();
    this.getCarTotalPrice();
    this.initForm();
    this.loadUserInfo();
    this.loadProducts();
    this.initWidthParams();
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy() {
    this.updateProducts();
  }

  async updateProducts() {
    try {
      // Verificar la cantidad de los productos
      const response = await this.back.addProductToBD(this.generateJson());
    } catch (error) {
      console.log(error);
      this.changeDetectorRef.markForCheck();
    }
    this.changeDetectorRef.markForCheck();
  }

  getDocument(id) {
    switch (id) {
      case 1: {
        this.typeDocument = 'CC';
        break;
      }
      case 4: {
        this.typeDocument = 'CE';
        break;
      }
      case 5: {
        this.typeDocument = 'PA';
        break;
      }
      case 6: {
        this.typeDocument = 'CIP';
        break;
      }
      case 7: {
        this.typeDocument = 'DPI';
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

      if (this.isBancolombia) {
        this.classCheckSelected = 1;
      } else  {
        this.classCheckSelected = 2;
      }
      this.clickCheckProduct(this.classCheckSelected);
      this.setPhone();
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      if (error.status === 404) {
        this.redirectErrorPage();
      }
    }
  }

  setPhone() {
    if (this.registerForm) {
      if (this.cellphone) {
        this.registerForm.patchValue({ cellphone: this.cellphone });
      } else {
        this.registerForm.patchValue({ cellphone: 0 });
      }
    } else  {
      this.registerForm.patchValue({ cellphone: 0 });
    }
  }

  get isBancolombia() {
    if (this.currentUser
      && this.currentUser.company
      && this.currentUser.company.community
      && this.currentUser.company.community.name == 'Grupo Bancolombia') {
      return true;
    }
    return false;
  }

  redirectErrorPage() {
    this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.ERROR}`]);
  }

  initForm() {
    /*this.registerForm = new FormGroup({
      address: new FormControl('', [Validators.required]),
      cellphone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)])
    });*/
    this.registerForm = new FormGroup({
      address: new FormControl(''),
      cellphone: new FormControl('')
    });

    this.registerFormBank = new FormGroup({
      address: new FormControl('')
    });
  }

  async getCountries() {
    try {
      await this.collectionService.isReady();
      this.country = {
        name: 'Colombia',
        id: '1'
      };
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  scrollToError() {

    /**El numero 3 puede cambiar en caso que se agreguen nuevos campos al formulario**/
    const elements = document.getElementsByClassName('ng-invalid');
    if (this.errorState || this.errorCity) {
      const element = document.getElementById('select-states');
      element.scrollIntoView({ block: 'start', behavior: 'smooth' });
    } else if (elements && elements[3]) {
      elements[3].scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  onSubmit() {
    if (!this.classCheckSelected) {
      this.emptyCheck = true;
    } else {
      if (this.formIsInvalid) {
        if (this.classCheckSelected == 2) {
          this.validateAllFormFields(this.registerForm);
          if (this.state && !this.state['id']) {
            this.errorState = true;
          }
          if (this.state && !this.city['id']) {
            this.errorCity = true;
          }
        } else {
          this.validateAllFormFields(this.registerFormBank);
        }
        this.scrollToError();
      }
    }
  }

  get formIsInvalid(): boolean {
    return (this.classCheckSelected == 2 && (this.registerForm.invalid || !this.selectIsCompleted())) ||
    (this.classCheckSelected ==1  && this.registerFormBank.invalid);
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
    if (this.shippingTaxes) {
      this.carTotalPrice = this.carTotalIva + this.carSubTotalPrice + this.shippingTaxes.price;
    }
  }

  goToMicrosite() {
    this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.FEED}`]);
  }

  changeQuantity(stock: number, product) {
    this.car.updateProductQuantity(product.id, stock);
    this.products = this.car.getProducts();
    if (this.hasANewQuantity) {
      this.updateProductsQuantity();
    }
    this.getCarTotalPrice();
    this.changeDetectorRef.markForCheck();
  }

  async updateProductsQuantity() {
    try {
      const response = await this.back.addProductToBD(this.generateJson());
      this.reloadProducts();
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      this.reloadProducts();
      this.changeDetectorRef.markForCheck();
    }
    this.hasANewQuantity = false;
  }

  setWidthParams() {
    this.viewWidth = window.innerWidth;
    if (this.viewWidth > 975) {
      this.canHide = false;
      this.showForm = true;
      this.showInfo = true;
    } else {
      this.canHide = true;
    }
  }

  initWidthParams() {
    this.viewWidth = window.innerWidth;
    if (this.viewWidth > 975) {
      this.showForm = true;
      this.showInfo = true;
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

  clickCheckProduct(numberSelect) {
    this.emptyCheck = false;
    this.emptyMessaje = false;
    this.errorState = false;
    this.errorCity = false;
    this.state = undefined;
    this.city = undefined;
    this.classCheckSelected = numberSelect;
    const cellphone = this.registerForm.get('cellphone');
    const address = this.registerForm.get('address');
    const addressBank = this.registerFormBank.get('address');
    addressBank.clearValidators();
    address.clearValidators();
    cellphone.clearValidators();
    if (this.classCheckSelected == 2) {
      this.registerFormBank.reset();
      cellphone.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)]);
      address.setValidators([Validators.required]);
      this.setPhone();
    } else  {
      this.registerForm.reset();
      addressBank.setValidators([Validators.required]);
    }
    addressBank.updateValueAndValidity();
    address.updateValueAndValidity();
    cellphone.updateValueAndValidity();
    this.updateCart(numberSelect);
  }

  async updateCart(numberSelect) {
    try {
      const request = {
        envio: numberSelect
      }
      const response = await this.back.updateCartProducts(request);
      this.shippingTaxes =  response.body.carroCompras.shippingTaxes;
      if (this.shippingTaxes) {
        this.carTotalPrice = this.carTotalIva + this.carSubTotalPrice + this.shippingTaxes.price;
      }
    } catch (error) {
      console.log(error);
      this.changeDetectorRef.markForCheck();
    }
    this.changeDetectorRef.markForCheck();
  }

  async loadProducts() {
    this.showView = 'loading';
    try {
      const response = await this.back.getCarProducts();
      this.products = [];
      response.carroCompras.commerceItems.forEach(element => {
        this.products.push(element);
      });
      this.car.setProducts(this.products);
      this.products = this.car.getProducts();

      if (response.carroCompras.shippingTaxes) {
        this.shippingTaxes =  response.carroCompras.shippingTaxes;
        if (this.shippingTaxes.id == 2) {
          this.classCheckSelected = 2;
          const address = this.registerForm.get('address');
          const cellphone = this.registerForm.get('cellphone');
          address.clearValidators();
          cellphone.clearValidators();
          address.setValidators([Validators.required]);
          cellphone.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)]);
          address.updateValueAndValidity();
          cellphone.updateValueAndValidity();
        } else if (this.shippingTaxes.id == 1) {
          this.classCheckSelected = 1;
          const address = this.registerFormBank.get('address');
          address.clearValidators();
          address.setValidators([Validators.required]);
          address.updateValueAndValidity();
        }
      }

      if (this.products.length == 0) {
        this.showView = 'noProducts';
      } else {
        this.showView = 'Products';
        this.disableButton();
      }
      this.getCarTotalPrice();
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      if (error.error.status == '600') {
        this.showView = 'noProducts';
      }
      this.changeDetectorRef.markForCheck();
    }
    this.changeDetectorRef.markForCheck();
  }

  async reloadProducts() {
    try {
      const response = await this.back.getCarProducts();
      this.products = [];
      response.carroCompras.commerceItems.forEach(element => {
        this.products.push(element);
      });
      this.car.setProducts(this.products);
      this.products = this.car.getProducts();
      if (this.products.length === 0) {
        this.showView = 'noProducts';
      } else {
        this.showView = 'Products';
        this.disableButton();
        this.getCarTotalPrice();
      }
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      if (error.error.status == '600') {
        this.showView = 'noProducts';
      }
      this.changeDetectorRef.markForCheck();
    }
    this.changeDetectorRef.markForCheck();
  }

  async deleteCheckedProducts() {
    if (!this.disabledButton) {
      try {
        const response_add = await this.back.addProductToBD(this.generateJsonWithValidProducts());
        try {
          this.deleteAndReload();
          this.changeDetectorRef.markForCheck();
        } catch (error) {
          this.changeDetectorRef.markForCheck();
        }
      } catch (error) {
        this.deleteAndReload();
        this.changeDetectorRef.markForCheck();
      }
      this.changeDetectorRef.markForCheck();
    }
  }

  async deleteAndReload() {
    const response = await this.back.deleteProductToBD(this.car.getCheckedProducts());
    const quantityCart = await this.car.getCartInfo();
    this.car.setTotalCartProducts(quantityCart);
    this.car.changeCartNumber(quantityCart);
    this.car.initCheckedList();
    this.reloadProducts();
    this.disabledButton = true;
  }

  getParamsToProducts() {
    return this.currentFilter;
  }

  async pay() {
    if (this.classCheckSelected ) {
      this.hasPending = false;
      this.emptyMessaje = false;
      this.emptyCheck = false;
      this.disablePayButton = true;
      this.productsWithError = false;

      if (this.classCheckSelected  && !this.formIsInvalid) {
        try {
          // Verificar la cantidad de los productos
          const response_add = await this.back.addProductToBD(this.generateJson());

          try {
            // Generarla orden de waybox
            const orden = await this.back.getOrden(this.generateJsonToWaybox());

            try {
              // Una vez se genere la orden, se reserva el stock
              const response = await this.back.reserveStock();
              this.gapush('send', 'event', 'TiendaCorporativa', 'ClicCarrito', 'ComprarExitoso');
              this.hasANewQuantity = true;
              this.wayboxPay(this.carTotalPrice, orden.body.publicKey, orden.body.referenciaOrden, orden.body.urlRedireccion);
              this.disablePayButton = false;
              this.changeDetectorRef.markForCheck();
            } catch (error) {
              this.disablePayButton = false;
              this.changeDetectorRef.markForCheck();
            }
            this.changeDetectorRef.markForCheck();

          } catch (error) {
            this.hasPending = true;
            this.disablePayButton = false;

            console.log(error)
            if (error.error.status === 500) {
              this.errorPending = '¡Ups! parece que algo ha salido mal, cominícate con info@rotalo.com.';
            } else {
              this.errorPending = 'Actualmente tienes una transacción en proceso, si no has recibido la confirmación de tu pago, escríbenos a info@rotalo.com.co';
            }
            this.changeDetectorRef.markForCheck();
          }
          this.changeDetectorRef.markForCheck();
        } catch (error) {
          console.log(error);
          this.reloadProducts();
          this.hasANewQuantity = true;
          this.disablePayButton = false;
          this.productsWithError = true;

          if (error.error.status == '602') {
            this.nameProductError = error.error.body.productosConErrores[0].producto.name;
          }

          this.changeDetectorRef.markForCheck();
        }
      } else {
        this.emptyMessaje = true;
        this.showForm = true;
        this.disablePayButton = false;
      }
    }
  }

  gapush(method, type, category, action, label) {
    const paramsGa = {
      event: 'pushEventGA',
      method: method,
      type: type,
      categoria: category,
      accion: action,
      etiqueta: label
    };
    window['dataLayer'].push(paramsGa);
  }

  generateJson() {
    const body = {
      productos: []
    };
    this.products.forEach(element => {
      body.productos.push(
        {
          'idProducto': element.product.id,
          'cantidad': element.quantity,
          'adicionar': false
        }
      );
    });

    return body;
  }

  generateJsonWithValidProducts() {
    const body = {
      productos: []
    };

    this.products.forEach(element => {
      if (element.quantity <= element.product.stock) {
        body.productos.push(
          {
            'idProducto': element.product.id,
            'cantidad': element.quantity,
            'adicionar': false
          }
        );
      }
    });
    return body;
  }

  generateJsonToWaybox() {
    const jsonProducts = [];
    this.products.forEach(element => {

      jsonProducts.push(
        {
          'idProducto': element.product.id,
          'nombre': element.product.name,
          'precio': element.product.price * element.quantity,
          'talla': element.product.size ?  element.product.size : '',
          'referencia' : element.product.reference ?  element.product.reference : '',
          'color': '',
          'numeroUnidades': element.quantity,
          'urlPhotoProducto': element.product.photos.url,
        }
      );
    });


    let json = {
      'totalOrder': this.carTotalPrice,
      'envio': this.classCheckSelected,
      'cliente': {
        'nombre': this.nameUser,
        'tipoDocumento': this.typeDocument,
        'numeroDocumento': this.documentNumber,
        'correoElectronico': this.email,
        'numeroCelular': this.cellphone
      },
      'datosDireccion': {
        'departamento': this.state && this.state.name ? this.state.name : '',
        'ciudad': this.city && this.city.name ?this.city.name : '',
        'direccion': '',
        'numeroContacto': this.registerForm && this.registerForm.get('cellphone').value  ? this.registerForm.get('cellphone').value : ''
      },
      'listaProductos': jsonProducts
    };

    debugger

    if (this.classCheckSelected == 2) {
      json.datosDireccion.direccion =
      this.registerForm && this.registerForm.get('address').value ? this.registerForm.get('address').value : '';
    } else  {
      json.datosDireccion.direccion =
      this.registerFormBank && this.registerFormBank.get('address').value ? this.registerFormBank.get('address').value : '';
    }

    return json;
  }

  disableButton() {
    this.disabledButton = true;
  }

  updateButtonStatus() {
    const checkedProducts = this.car.getCheckedProducts();
    if (checkedProducts.idProductos.length == 0) {
      this.disabledButton = true;
    } else {
      this.disabledButton = false;
    }
  }

  goToTerms() {
    this.router.navigate([`/${ROUTES.TERMS}`]);
  }

  wayboxPay(amount, publicKey, referenciaOrden, urlRedireccion) {
    const checkout = new WidgetCheckout({
      currency: 'COP',
      amountInCents: amount + '00',
      reference: referenciaOrden,
      publicKey: publicKey,
      redirectUrl: urlRedireccion
    });
    checkout.open((e) => {
      this.car.setWayboxJson(e);
      this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.RESPONSE}`]);
    });
  }
}
