import {
  ChangeDetectorRef,
  ViewChild,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { CAROUSEL_CONFIG } from './carousel.config';
import { NgxCarousel } from 'ngx-carousel';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import { ProductsService } from '../../services/products.service';
import { ROUTES } from '../../router/routes';
import { Router } from '@angular/router';
import { ModalInterface } from '../../commons/interfaces/modal.interface';
import { ConversationInterface } from '../../commons/interfaces/conversation.interface';
import { CurrentSessionService } from '../../services/current-session.service';
import { UserService } from '../../services/user.service';
import { MessagesService } from '../../services/messages.service';
import { Validators, FormBuilder, AbstractControl, FormGroup } from '@angular/forms';
import { ShareInfoChatService } from '../chat-thread/shareInfoChat.service';
import { BuyService } from '../../services/buy.service';
import { NavigationService } from '../../pages/products/navigation.service';
import { START_DATE_BF, END_DATE_BF, START_DATE } from '../../commons/constants/dates-promos.contants';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ReportPublicationComponent } from '../report-publication/report-publication.component';
import { ModalShareProductService } from '../modal-shareProduct/modal-shareProduct.service';
import { ModalDeleteProductComponent } from '../modal-delete-product/modal-delete-product.component';
import { SimulateCreditService } from '../../services/simulate-credit.service';
import { CountUp, CountUpOptions } from 'countup.js';

function isEmailOwner(c: AbstractControl): { [key: string]: boolean } | null {
  const email = c;
  if (email.value == this.currentEmail) {
    return { emailError: true };
  }
  return null;
}

function priceVehicleValidatorMax(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const priceValue = c.value;
  if (priceValue > 5000000000) {
    return { priceValueMax: true };
  }
  return null;
}

function priceVehicleValidatorMin(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const priceValue = c.value;
  if (priceValue < 10000000) {
    return { priceValueMin: true };
  }
  return null;
}

@Component({
  selector: 'detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {
  public carouselConfig: NgxCarousel;
  public products;
  public nameProducto: String;
  public productsPhotos: any;
  public productStatus: boolean;
  public productChecked: String;
  public configModal: ModalInterface;
  public isSufiModalShowed: boolean = false;
  public isOfferModalShowed: boolean = false;
  public isModalSendMessageShowed: boolean = false;
  public isModalBuyShowed: boolean = false;
  public idUser: string = this.currentSessionSevice.getIdUser();
  public conversation: ConversationInterface;
  private minVehicleValue = 10000000;
  private maxVehicleValue = 5000000000;
  public sendInfoProduct;
  public quantityForm;
  public showInputShare = true;
  public messageSuccess: boolean;
  public messageError: boolean;
  public textError: boolean;
  public visitsNumber = 0;
  @Input() idProduct: number;
  @Input() readOnly: boolean = false;
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  public showButtons = false;
  readonly defaultImage: string = '../assets/img/product-no-image.png';
  public firstName = '';
  public screenHeight;
  public screenWidth;
  private currentEmail;
  public countryId;
  public totalStock = 1;
  public idCountry = 1;
  public startDateBf = START_DATE_BF;
  public startDate = START_DATE;
  public endDate = END_DATE_BF;
  public courrentDate = new Date();
  public codeCampaign;
  public showSticker = false;
  public stickerUrl = '';
  public showPayButton = false;
  public showSufiButton = false;
  public rangeTimetoPayArray: Array<number> = [12, 24, 36, 48, 60, 72, 84];
  public simulateForm: FormGroup;
  public interesNominal = 0.0105;
  public porcentajeSimulacion = 20;
  public childrens;

  public optionsCountSimulate: CountUpOptions = {
    decimalPlaces: 2,
    duration: 1,
    useEasing: true,
    prefix: '$'
  };


  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 750) {
      this.showInputShare = true;
    }
  }




  constructor(
    private productsService: ProductsService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private currentSessionSevice: CurrentSessionService,
    private userService: UserService,
    private messagesService: MessagesService,
    private shareInfoChatService: ShareInfoChatService,
    private fb: FormBuilder,
    private buyService: BuyService,
    private navigationService: NavigationService,
    public dialog: MatDialog,
    private modalService: ModalShareProductService,
    private simulateCreditService: SimulateCreditService
  ) {
    this.carouselConfig = CAROUSEL_CONFIG;
    let countryId;
    if (this.navigationService.getCurrentCountryId()) {
      countryId = this.navigationService.getCurrentCountryId();
    } else {
      countryId = this.currentSessionSevice.currentUser()['countryId'];
    }
    this.idCountry = countryId;
  }

  ngOnInit() {
    const currentUser = this.currentSessionSevice.currentUser();
    if (currentUser) {
      this.currentEmail = currentUser.email;
      this.countryId = currentUser.countryId;
    }

    this.initShareForm();
    this.initQuantityForm();
    this.loadProduct();

  }

  initShareForm() {
    this.sendInfoProduct = this.fb.group(
      {
        email: ['', [Validators.required, isEmailOwner.bind(this), Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]]
      }
    );
  }

  initQuantityForm() {
    this.quantityForm = this.fb.group(
      {
        stock: [1, [Validators.required, Validators.min(1), Validators.max(1)]]
      }
    );
  }

  visitorCounter() {
    this.productsService.visitorCounter(this.products.id).subscribe((response) => {
      if (response.status == 0) {
        this.visitsNumber = response.body.visitas;
        this.changeDetectorRef.markForCheck();
      }
    }, (error) => { console.log(error); });
  }

  clickArrow() {
    this.changeDetectorRef.markForCheck();
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

  sendMessage() {
    this.shareInfoChatService.setIdConversation(this.products.user.id);
    this.shareInfoChatService.setProductUserId(this.products.id);
    let photoProduct;
    let company;
    if (this.products.photoList) {
      if (!this.products.photoList[0] || !this.products.photoList[0].url) {
        photoProduct = undefined;
      } else {
        photoProduct = this.products.photoList[0].url;
      }
    }
    if (this.products.user.company) {
      if (!this.products.user.company.name) {
        company = undefined;
      } else {
        company = '';
      }
    }
    const newUser = {
      fotoEmisario: photoProduct,
      idEmisario: Number(this.products.id),
      messages: [],
      nombreEmisario: this.products.name,
      inicioConversacion: true,
      numeroNotificacionesNoLeidas: 0,
      comunidad: company,
      rol: 'product',
      precio: this.products.price,
      idUsuarioChat: this.products.user.id,
      nombreUsuarioChat: this.products.user.name,
      calificacion: this.products.userCalification ? this.products.userCalification : 0
    };

    if (this.products.subcategory && (
      this.products.subcategory.name == 'Carros' ||
      this.products.subcategory.name == 'Motos'  ||
      this.products.subcategory.category &&
      this.products.subcategory.category.name == 'Inmuebles'))  {
        this.gapush(
          'send',
          'event',
          'Productos',
          this.products.subcategory.name,
          'ContactaPorRotaloExitoso'
        );
    }


    this.shareInfoChatService.setNewConversation(newUser);
    this.router.navigate([
      `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.MESSAGES}`
    ]);
  }

  setFormSufi() {
    let creditValue = 0;
    if (this.products.porcentajeSimulacion) {
      this.porcentajeSimulacion = this.products.porcentajeSimulacion;
    }
    if (this.products && this.products.price && this.porcentajeSimulacion) {
      creditValue = (this.products.price) * (this.porcentajeSimulacion) / 100;
    }
    this.simulateForm = this.fb.group(
      {
        'credit-value': [
          creditValue,
          [
            Validators.required,
            priceVehicleValidatorMax,
            priceVehicleValidatorMin
          ]
        ],
        'term-months': [72, Validators.required]
      }
    );
  }

  validateMonths() {
    if (this.products && this.products['vehicle']) {
      const currentYear = new Date().getFullYear();
      const modelo = this.products['model'];
      const differenceYear = currentYear - modelo;
      let nameBrandMoto;
      if (this.products['vehicle'].line.brand) {
        nameBrandMoto = this.products['vehicle'].line.brand.name;
      }
      if (differenceYear >= 5 && differenceYear <= 10 || nameBrandMoto == 'BMW') {
        this.rangeTimetoPayArray = [12, 24, 36, 48, 60];
        this.simulateForm.patchValue({ 'term-months': 60 });
      }
    }
  }

  loadProduct() {
    this.productsService.getProductsByIdDetail(this.idProduct).subscribe((response) => {
      if (response.body) {
        this.products = response.body.productos[0];
        if (this.products.interesNominal) {
          this.interesNominal = this.products.interesNominal / 100;
        }
        if (this.products.porcentajeSimulacion) {
          this.porcentajeSimulacion = this.products.porcentajeSimulacion / 100;
        }
        if (this.products.vehicle) {
          this.showSufiButton = this.products.vehicle.line.brand.showSufiSimulator;
        }
        this.setFormSufi();
        this.validateMonths();
        if (this.products.campaignInformation) {
          this.codeCampaign = this.products.campaignInformation.code;
          this.showSticker = this.products.campaignInformation.showSticker;
          this.stickerUrl = this.products.campaignInformation.stickerUrl;
          this.showPayButton = this.products.showPayButton;
        }
        this.totalStock = this.products.stock;
        if (this.products['stock']) {
          this.totalStock = this.products['stock'];
        } else {
          this.totalStock = 1;
        }
        const price = this.quantityForm.get('stock');
        price.clearValidators();
        price.setValidators([Validators.required, Validators.min(1), Validators.max(this.totalStock)]);
        price.updateValueAndValidity();


        const fullName = this.products.user.name.split(' ');
        if (this.products.user.name) {
          this.firstName = fullName[0];
          this.onLoadProduct(this.products);
          this.productIsSold(this.products);
          if (this.products.photoList) {
            this.productsPhotos = [].concat(this.products.photoList);
            this.products.photoList = this.productsPhotos;
          }
          if (this.products.photoList) {
            this.conversation = {
              photo: this.products.photoList[0].url,
              name: this.products.user.name
            };
          }
          this.productChecked = this.products.status;
          this.productStatus = this.products.status === 'active';
          this.visitorCounter();
          this.changeDetectorRef.markForCheck();
        }
        if (this.products.childrens)
        {
          this.childrens = this.products.childrens;
        }
      }
    },
      (error) => {
        console.log(error);
        if(error.error){
          if(error.error.status == '629' || error.status == '500'){
            this.redirectErrorPage()
          }
        }
      });
  }

  calcularCuotasPrimerPlan() {
    let va = 0;
    let n = 0;
    const i = this.interesNominal;

    this.simulateForm.get('credit-value') &&
      //this.simulateForm.get('credit-value').value &&
      this.products.price &&
      this.products.price > this.simulateForm.get('credit-value').value
      ? va = this.products.price - this.simulateForm.get('credit-value').value : va = 0;


    this.simulateForm.get('term-months') &&
      this.simulateForm.get('term-months').value
      ? n = this.simulateForm.get('term-months').value : n = 0;

    return (va * (Math.pow((1 + i), n)) * i) / ((Math.pow((1 + i), n)) - 1);
  }

  calcularSeguro() {
    let va = 0;
    this.simulateForm.get('credit-value') &&
      //this.simulateForm.get('credit-value').value &&
      this.products.price &&
      this.products.price > this.simulateForm.get('credit-value').value
      ? va = this.products.price - this.simulateForm.get('credit-value').value : va = 0;
    return ((va * 0.12) / 100);
  }

  calcularCuotasExtraSegundoPlan() {
    let va = 0;
    this.simulateForm.get('credit-value') &&
     // this.simulateForm.get('credit-value').value &&
      this.products.price &&
      this.products.price > this.simulateForm.get('credit-value').value
      ? va = this.products.price - this.simulateForm.get('credit-value').value : va = 0;

    let n = 0;
    this.simulateForm.get('term-months') &&
      this.simulateForm.get('term-months').value ? n = this.simulateForm.get('term-months').value : n = 0;
    const i = this.interesNominal;
    return (va * (Math.pow((1 + i), n)) * i) / ((Math.pow((1 + i), n)) - 1) * 2;
  }

  calcularCuotasSegundoPlan() {
    let ve = 0;
    ve = this.calcularCuotasExtraSegundoPlan();
    const i = this.interesNominal;
    const i1 = Math.pow((1 + i), 6) - 1;
    let va = 0;
    this.simulateForm.get('credit-value') &&
     // this.simulateForm.get('credit-value').value &&
      this.products.price &&
      this.products.price > this.simulateForm.get('credit-value').value
      ? va = this.products.price - this.simulateForm.get('credit-value').value : va = 0;

    let n = 0;
    this.simulateForm.get('term-months') &&
      this.simulateForm.get('term-months').value ? n = this.simulateForm.get('term-months').value : n = 0;
    const n1 = n / 6;
    const vae = (ve * ((Math.pow((1 + i1), n1)) - 1)) / (Math.pow((1 + i1), n1) * i1);
    const pago = ((va - vae) * ((Math.pow((1 + i), n)) * i)) / ((Math.pow((1 + i), n)) - 1);
    return pago;
  }

  productIsSold(product) {
    if (product.status && product.status === 'sold') {
      this.showButtons = false;
    } else {
      this.showButtons = true;
    }
  }

  redirectErrorPage() {
    this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.ERROR}`]);
  }

  onLoadProduct(product) {
    this.notify.emit(product);
  }

  getUrlImge() {
    return ('url(' + this.products.user.photos.url.replace(/ /g, '%20')) + ')';
  }

  saveCheck() {
    this.productStatus = !this.productStatus;
    this.productStatus
      ? (this.productChecked = 'active')
      : (this.productChecked = 'inactive');
    const params = {
      estado: this.productStatus ? 'active' : 'inactive'
    };
    this.productsService
      .updateProductStatus(this.products.id, params)
      .then(response => { });
  }

  /*changeStatusBuy() {
    const params = {
      status: 'buying'
    };
    this.productsService
      .updateProduct(this.products.id, params)
      .then(response => {
        this.productsService.products = [];
      });
  }*/

  checkSufiBotton() {
    if (this.products && this.products['model']) {
      const priceVehicle = this.products.price;
      const currentUser = this.currentSessionSevice.currentUser();
      const countryId = Number(currentUser['countryId']);
      const type = this.products['typeVehicle'];
      const currentYear = new Date().getFullYear();
      const modelo = this.products['model'];
      const differenceYear = currentYear - modelo;
      let nameBrandMoto;
      if (this.products.vehicle && this.products.vehicle.line.brand) {
        nameBrandMoto = this.products.vehicle.line.brand.name;
      }

      if ((this.products.subcategory.name === 'Carros' && differenceYear <= 10 && type === 'Particular' && countryId === 1 &&
        priceVehicle >= this.minVehicleValue && priceVehicle <= this.maxVehicleValue && this.showSufiButton)
        || (this.products.subcategory.name === 'Motos' && differenceYear <= 5 && countryId === 1 &&
          priceVehicle >= this.minVehicleValue && nameBrandMoto == 'BMW' && this.showSufiButton)
      ) {
        return true;
      }
    }
    return false;
  }

  checkBAMBotton() {
    if (this.products) {
      const priceVehicle = this.products.price;
      const currency = this.products.currency;
      const currentUser = this.currentSessionSevice.currentUser();
      const countryId = Number(currentUser['countryId']);
      if (this.products['sell-type'] === 'VENTA') {
        if (countryId === 9 && currency == 'GTQ' && priceVehicle >= 5000) {
          return true;
        } else if (countryId === 9 && currency == 'USD' && priceVehicle >= 650) {
          return true;
        }
      }
    }
    return false;
  }

  changeDate() {
    return (
      new Date(this.products['publish-until']) <
      new Date(new Date().toDateString()) ||
      this.products.status === 'expired'
    );
  }

  validateSession() {
    return this.products && this.products.user.id == this.idUser;
  }

  isSellProcess() {
    return this.products && this.products.status == 'sell_process';
  }

  isSold() {
    return this.products && this.products.status == 'sold';
  }

  async deleteProduct(product: ProductInterface) {
    try {
      const result = confirm('¿Seguro quieres borrar esta publicación?');
      if (!result) {
        return;
      }
      const response = await this.productsService.deleteProduct(product.id);
      this.productsService.products = [];
      this.router.navigate([
        `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
      ]);
    } catch (error) { }
  }

  editProduct(product: ProductInterface) {
    this.router.navigate([
      `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.UPLOAD}/${product.id}`
    ]);
  }

  getLocation(product): string {
    const city = product.city;
    const state = city.state;
    return `${city.name}, ${state.name}`;
  }

  buyProduct(id: number | string) {
    if (!this.formIsInValid) {
      let quantity = 1;
      if (this.quantityForm.get('stock').value) {
        quantity = this.quantityForm.get('stock').value;
      }
      const quantityProduct = {
        idProduct: id,
        quantity: quantity
      };
      this.buyService.setQuantityProduct(quantityProduct);
      const urlBuyProduct = `${ROUTES.PRODUCTS.LINK}/${
        ROUTES.PRODUCTS.BUY
        }/${id}`;
      this.router.navigate([urlBuyProduct]);
    }
  }

  creditProduct(id: number | string) {
    const urlBuyProduct = `${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.FINANCEBAM
      }/${id}`;
    this.router.navigate([urlBuyProduct]);
  }

  rentProduct(id: number | string) {
    this.buyService.rentProduct(id).subscribe((response) => {
      const urlBuyProduct = `${ROUTES.PRODUCTS.LINK}/${
        ROUTES.PRODUCTS.BUY
        }/${id}`;
      this.router.navigate([urlBuyProduct]);
    }
      , (error) => {
        console.log(error);
      });
  }

  /*async showBuyModal() {
    try {
      this.products = await this.productsService.getProductsById(
        this.idProduct
      );
      this.isModalBuyShowed = true;
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      console.log('Error: ', error);
    }
  }*/

  showMessageModal(evt) {
    this.isModalBuyShowed = evt.isModalBuyShowed;
    this.isModalSendMessageShowed = evt.isModalSendMessageShowed;
  }

  openSufiModal(product: ProductInterface) {
    this.isSufiModalShowed = true;
    this.configurarModal(product);
  }

  openSimulateCreditSufi(id: number | string) {
    const urlSimulateCredit = `${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.SIMULATECREDIT
      }/${id}`;
    this.simulateCreditService.setInitialQuota(this.simulateForm.get('credit-value').value);
    this.simulateCreditService.setMonths(this.simulateForm.get('term-months').value);
    this.router.navigate([urlSimulateCredit]);
  }

  openOfferModal(product: ProductInterface) {
    this.isOfferModalShowed = true;
    this.configurarModal(product);
  }

  private configurarModal(product: ProductInterface) {
    this.configModal = {
      photo: product.photoList ? product.photoList[0].url : this.defaultImage,
      title: product.name,
      price: product.price,
      'product-id': product.id,
      type: product['sell-type'],
      currency: product.currency
    };
  }

  validateMobile() {
    if (this.screenWidth <= 750) {
      this.showInputShare = !this.showInputShare;
    } else {
      this.showInputShare = true;
    }
  }

  motoHasCharacteristics() {
    if (this.products.vehicle && this.products.vehicle.vehicleType == 'MOTO') {
      if (this.products.vehicle['uniqueOwner'] || this.products.vehicle.absBrakes) {
        return true;
      }
    }
    return false;
  }

  autoHasCharacteristics() {
    if (this.products.vehicle && this.products.vehicle.vehicleType == 'AUTO') {
      if (this.products.vehicle['uniqueOwner'] || this.products.vehicle.absBrakes ||
        this.products.vehicle.airbag || this.products.vehicle.airConditioner || this.products.vehicle.typeOfSeat) {
        return true;
      }
    }
    return false;
  }


  get showOptionsVehicles() {
    if (this.products) {
      if (this.products.subcategory.category.id == 6) {
        if (this.products.subcategory.id != 11) {
          return false;
        }
      }
      return true;
    }
  }
  get showOptionEstate() {
    if (this.products) {
      if (this.products.subcategory.category.id == 7) {
        return false;
      }
    }
    return true;
  }


  addStock() {
    if (this.showOptionsVehicles && this.showOptionEstate) {
      if (this.quantityForm.get('stock').value < this.totalStock) {
        let stock = this.quantityForm.get('stock').value;
        stock = ++stock;
        this.quantityForm.patchValue({ stock: stock });
      }
    }
  }

  minusStock() {
    if (this.showOptionsVehicles && this.showOptionEstate) {
      if (this.quantityForm.get('stock').value > 1) {
        let stock = this.quantityForm.get('stock').value;
        stock = --stock;
        this.quantityForm.patchValue({ stock: stock });
      }
    }
  }


  get isPromoDate() {
    if (this.courrentDate >= this.startDateBf && this.courrentDate <= this.endDate) {
      return true;
    }
    return false;
  }

  get isPromoDateBefore() {
    if (this.courrentDate >= this.startDate && this.courrentDate <= this.endDate) {
      return true;
    }
    return false;
  }

  get isActivePromo() {
    if (this.products['specialDate'] && this.products['specialDate'].active) {
      return true;
    }
    return false;
  }

  get formIsInValid() {
    return this.quantityForm.invalid;
  }

  get isCategoryImmovables() {
    if (this.products && this.products.subcategory && this.products.subcategory.category.name == 'Inmuebles') {
      return true;
    }
    return false;
  }

  get isSubcategoryCars() {
    if (this.products && this.products.subcategory && this.products.subcategory.name == 'Carros') {
      return true;
    }
    return false;
  }

  get isSubcategoryMotos() {
    if (this.products && this.products.subcategory && this.products.subcategory.name == 'Motos') {
      return true;
    }
    return false;
  }

  goToHipotecario() {
    this.sufiRegister();
    window.open(
      'https://www.grupobancolombia.com/wps/portal/personas/necesidades/casa/proyectos-de-vivienda-nueva-financiados/credito-adquisicion-leasing-habitacional'
      , '_blank');
  }

  sufiRegister() {
    const params = {
      'idProducto': this.idProduct,
      'fuente': 'hipotecario'
    }
    this.productsService.sufiRegistro(params).subscribe((response) => {
    },
      (error) => {
        console.log(error);
      })
  }

  hideAnimation() {
    this.showSticker = false;
    this.changeDetectorRef.markForCheck();
  }

  openModalDeleteProduct(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '300px';
    dialogConfig.maxWidth = '900px';
    dialogConfig.width = '55%';
    dialogConfig.autoFocus = false;
    const option = {
      action: 'delete',
      productId: this.products.id
    }
    dialogConfig.data = option;
    const dialogRef = this.dialog.open(ModalDeleteProductComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result == 'delete_done') {
        location.reload();
        this.router.navigate([`/${ROUTES.HOME}`]);
      }
      let gaPushParam = 'VendiRotaloExitoso';
      if (result && result.seleccion && result.seleccion === 'otro'){
      gaPushParam = 'OtroExitoso';
      }
      this.gapush(
        'send',
        'event',
        'EliminarArticulo',
        'Cuentanos',
        gaPushParam
      );
    });
  }

  openModalInactiveProduct(): void {
    let estado = this.productStatus ? (this.productChecked = 'active') : (this.productChecked = 'inactive');

    if (estado == 'inactive') {
      this.saveCheck()
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.minWidth = '300px';
      dialogConfig.maxWidth = '900px';
      dialogConfig.width = '55%';
      dialogConfig.autoFocus = false;
      const option = {
        action: 'update',
        productId: this.products.id,
        estado: this.productStatus ? (this.productChecked = 'inactive') : (this.productChecked = 'active')
      }
      dialogConfig.data = option;
      const dialogRef = this.dialog.open(ModalDeleteProductComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.action && result.action == 'update_done') {
          this.productStatus = !this.productStatus;
          this.productStatus ? (this.productChecked = 'active') : (this.productChecked = 'inactive');
          this.changeDetectorRef.markForCheck();
        }
        let gaPushParam = 'VendiExitoso';
        if (result && result.seleccion && result.seleccion === 'otro'){
        gaPushParam = 'OtroExitoso';
        }
        this.gapush(
          'send',
          'event',
          'InactivarArticulo',
          'Cuentanos',
          gaPushParam
        );
      });
    }
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '300px';
    dialogConfig.maxWidth = '900px';
    dialogConfig.width = '55%';

    dialogConfig.autoFocus = false;
    dialogConfig.data = this.products.id;
    const dialogRef = this.dialog.open(ReportPublicationComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  public shareProduct(id: string, product) {
    if (product.id) {
      this.modalService.setProductId(product.id);
      this.modalService.open(id);
    }
  }

  sendMessageWhatsapp(id) {
    if (this.products.subcategory && (
      this.products.subcategory.name == 'Carros' ||
      this.products.subcategory.name == 'Motos'  ||
      this.products.subcategory.category &&
      this.products.subcategory.category.name == 'Inmuebles'))  {
        this.gapush(
          'send',
          'event',
          'Productos',
          this.products.subcategory.name,
          'ComparteProductoWhatsapp'
        );
    }
    const base_url = window.location.origin;
    const url = `https://api.whatsapp.com/send?text=¡Hola!👋vi%20esto%20en%20Rótalo%20y%20creo%20que%20puede%20gustarte.%20Entra%20ya%20a%20
    ${base_url}/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${id}`;
    window.open(
      url,
      '_blank');
  }

  sendMessageWhatsappUser() {
    const productName = this.products.name;
    let phoneNumber = this.products.user.cellphone;
    if (this.products.subcategory &&
      this.products.subcategory.category &&
      this.products.subcategory.category.name == 'Inmuebles')  {
        this.gapush(
          'send',
          'event',
          'Productos',
          this.products.subcategory.name,
          'ContactaPorWhatsappExitoso'
        );
    }
    if (window.location.href.includes('gt')) {
      phoneNumber = '502' + phoneNumber;
    } else {
      phoneNumber = '57' + phoneNumber;
    }
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=¡Hola!👋vi%20tu%20publicación%20"${productName}"%20en%20Rótalo%20y%20me%20gustaría%20que%20me%20dieras%20más%20información.`;
    window.open(
      url,
      '_blank');
  }
}
