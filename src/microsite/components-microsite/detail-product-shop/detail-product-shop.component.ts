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
import { ProductInterface } from './../../../commons/interfaces/product.interface';
import { ProductsService } from '../../../services/products.service';
import { ROUTES } from '../../../router/routes';
import { Router } from '@angular/router';
import { ModalInterface } from '../../../commons/interfaces/modal.interface';
import { ConversationInterface } from '../../../commons/interfaces/conversation.interface';
import { CurrentSessionService } from '../../../services/current-session.service';
import { UserService } from '../../../services/user.service';
import { MessagesService } from '../../../services/messages.service';
import { Validators, FormBuilder, AbstractControl, FormGroup } from '@angular/forms';
import { ShareInfoChatService } from '../../../components/chat-thread/shareInfoChat.service';
import { BuyService } from '../../../services/buy.service';
import { NavigationService } from '../../../pages/products/navigation.service';
import { START_DATE_BF, END_DATE_BF } from '../../../commons/constants/dates-promos.contants';
import { ShoppingCarService } from '../../services-microsite/front/shopping-car.service';
import { ProductsMicrositeService } from '../../services-microsite/back/products-microsite.service';
import { FeedMicrositeService } from '../../pages-microsite/products-microsite/feedMicrosite.service';
import { ModalShareProductService } from '../../../components/modal-shareProduct/modal-shareProduct.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalFormRegisterComponent } from '../modal-form-register/modal-form-register.component';
import { ConfigurationService } from '../../../services/configuration.service';
import { SimulateCreditService } from '../../../services/simulate-credit.service';

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
  selector: 'detail-product-shop',
  templateUrl: './detail-product-shop.component.html',
  styleUrls: ['./detail-product-shop.component.scss']
})
export class DetailProductShopComponent implements OnInit {

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
  public startDate = START_DATE_BF;
  public endDate = END_DATE_BF;
  public courrentDate = new Date();
  private currentFilter: Object;
  showModalBuy = false;
  productForModal = {};
  public childrens;
  public errorSize;
  public childSelected;
  public reference;
  public simulateForm: FormGroup;
  public interesNominal = 0.0105;
  public porcentajeSimulacion = 20;
  public showSufiButton = false;
  public rangeTimetoPayArray: Array<number> = [12, 24, 36, 48, 60, 72, 84];
  public tradicionalSimulacion;
  public especialSimulacion;
  public showForm = false ;
  public contactUser: FormGroup;
  public showSuccess = false;
  public errorSuccess = false;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 750) {
      this.showInputShare = true;
    }
  }

  constructor(
    public dialog: MatDialog,
    private productsService: ProductsService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private userService: UserService,
    private messagesService: MessagesService,
    private shareInfoChatService: ShareInfoChatService,
    private fb: FormBuilder,
    private buyService: BuyService,
    private navigationService: NavigationService,
    private car: ShoppingCarService,
    private back: ProductsMicrositeService,
    private feedService: FeedMicrositeService,
    private modalService: ModalShareProductService,
    private configurationService: ConfigurationService,
    private simulateCreditService: SimulateCreditService
  ) {
    this.currentFilter = this.feedService.getCurrentFilter();
    this.carouselConfig = CAROUSEL_CONFIG;
    this.idCountry = 1;
  }

  ngOnInit() {

    this.countryId = 1;
    this.initShareForm();
    this.loadProduct();
    this.initSufiForm();
  }

  initSufiForm() {
    this.contactUser = this.fb.group({
      'celular': ['', [Validators.required, Validators.pattern(/^\d{10}$/)]
      ],
      'horarioContacto': ['Mañana', Validators.required],
      'check-authorization': ['', Validators.required]
    });
  }

  creditRequest() {
    if (this.contactUser.valid && this.contactUser.get('check-authorization').value) {
      const celular = this.contactUser.get('celular').value;
      const horarioContacto = this.contactUser.get('horarioContacto').value;
      const creditValue = this.simulateForm.get('credit-value').value;
      const termMonths = this.simulateForm.get('term-months').value;
      const infoVehicle = {
        'plazo': termMonths,
        'cuotaInicial': creditValue ? creditValue : 0,
        'valorAFinanciar': this.products.price,
        'productId': this.idProduct,
        'celular': celular,
        'horarioContacto': horarioContacto,
        'storeId': this.configurationService.storeIdPrivate
      };
      this.simulateCreditService.sendSimulateCreditFeria(infoVehicle).then(response => {
        this.errorSuccess = false;
        this.showSuccess = true;
        this.gapush(
          'send',
          'event',
          'ProductosSufi',
          'ClicQuieroMasInfoSimulador',
          'EnvioExitoso'
        );
        this.changeDetectorRef.markForCheck();
      }).catch(httpErrorResponse => {
        console.log(httpErrorResponse);
       });

  } else  {
    this.errorSuccess = true;
    this.showSuccess = false;
  }
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
        stock: [1, [Validators.required, Validators.min(1), Validators.max(this.products.stock)]]
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


  public shareProduct(id: string, product) {
    if (product.id) {
      this.modalService.setProductId(product.id);
      this.modalService.open(id);
    }
  }

  /*
  shareProduct() {
    if (!this.sendInfoProduct.invalid) {
      const params = {
        correo: this.sendInfoProduct.get('email').value
      };
      this.productsService
        .shareProduct(params, this.products.id)
        .then(response => {
          this.messageSuccess = true;
          this.sendInfoProduct.reset();
          this.gapush(
            'send',
            'event',
            'Productos',
            'ClicInferior',
            'CompartirEsteProductoExitosoDetalleCorporativo'
          );
          this.changeDetectorRef.markForCheck();
        })
        .catch(httpErrorResponse => {
          if (httpErrorResponse.status === 422) {
            this.textError = httpErrorResponse.error.errors[0].detail;
            this.messageError = true;
          }
          this.changeDetectorRef.markForCheck();
        });
    }
  }*/

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
    this.shareInfoChatService.setIdConversation(this.products.id);
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
    this.shareInfoChatService.setNewConversation(newUser);
    this.router.navigate([
      `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.MESSAGES}`
    ]);
  }


  loadProduct() {
    const params =  {
      idTienda: this.configurationService.storeIdPublic,
      idProducto: this.idProduct
    };
    this.productsService.getProductsByIdDetailPublic(params).subscribe((reponse) => {
      if (reponse.body) {

        this.products = reponse.body.productos[0];

        if (this.products.porcentajeSimulacion) {
          this.porcentajeSimulacion = this.products.porcentajeSimulacion / 100;
        }
        if (this.products.vehicle) {
          this.showSufiButton = this.products.vehicle.line.brand.showSufiSimulator;
        }
        this.setFormSufi();

        this.initQuantityForm();
        this.totalStock = this.products.stock;
        if (this.products['stock']) {
          this.totalStock = this.products['stock'];
        } else {
          this.totalStock = 1;
        }
        if(this.products && this.products.children && this.products.children[0].stock){
          this.totalStock = this.products.children[0].stock;
        }

        /*      const price = this.quantityForm.get('stock');
              price.clearValidators();
              price.setValidators([Validators.required, Validators.min(1), Validators.max(this.totalStock)]);
              price.updateValueAndValidity();
      */

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
        //  this.visitorCounter();
          this.changeDetectorRef.markForCheck();
        }
        this.reference = this.products.reference;
        if (this.products.children) {
          this.childrens = this.products.children;
          this.childSelected = this.products.children[0];
          this.reference = this.childSelected.reference;
        }
      }
    },
      (error) => {
        console.log(error);
      });
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
    if (this.products && this.products['typeVehicle'] && this.products['model']) {
      const priceVehicle = this.products.price;
      const countryId = 1;
      const type = this.products['typeVehicle'];
      const currentYear = new Date().getFullYear() + 1;
      const modelo = this.products['model'];
      const differenceYear = currentYear - modelo;

      if (this.products.subcategory.name === 'Carros' && differenceYear <= 10 && type === 'Particular' && countryId === 1 &&
        priceVehicle >= this.minVehicleValue &&
        priceVehicle <= this.maxVehicleValue
      ) {
        return true;
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

  updateSize(id) {
    this.errorSize = false;
    for (const child of this.products.children) {
      if (child.id == id) {
        this.childSelected = child;
        this.totalStock = child.stock;
        this.reference = child.reference;
      }
    }
    this.quantityForm = this.fb.group(
      {
        stock: [1, [Validators.required, Validators.min(1), Validators.max(this.totalStock)]]
      }
    );
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
      type: product['sellType'],
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

  async addToShoppingCar(product) {
    let idProducto;
    let nombreProducto = this.products.name;
    let fotoProducto = this.products.photoList;
    if(!product)
    {
      this.errorSize = true;
    }
    if(!product.id) {
      for(let children of this.products.children) {
        if(children.id==product)
        {
          idProducto = children.id;
        }
      }
    }
    else {
      idProducto = product.id;
    }
    if (this.quantityForm.get('stock').value > 0 && this.quantityForm.get('stock').value <= this.totalStock) {
      const body = {
        productos: [
          {
            'idProducto': idProducto,
            'cantidad': this.quantityForm.get('stock').value,
            'adicionar': true
          }
        ]
      };
      try {
        const added = await this.back.addProductToBD(body);
        try {
          this.productForModal = {
            'name': nombreProducto,
            'quantity': this.quantityForm.get('stock').value,
            'price': this.quantityForm.get('stock').value * product.price,
            'photos': fotoProducto
          };
          this.showModalBuy = true;
          const quantityCart = await this.car.getCartInfo();
          this.car.setTotalCartProducts(quantityCart);
          this.car.changeCartNumber(quantityCart);
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  goToShoppingCar() {
    this.router.navigate([
      `/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.CAR}`
    ]);
  }

  getParamsToProducts() {
    return this.currentFilter;
  }

  closeModal() {
    this.showModalBuy = false;
  }

  sendMessageWhatsapp(id) {
    if (this.products.subcategory && (
      this.products.subcategory.name == 'Carros' ||
      this.products.subcategory.name == 'Motos' ||
      this.products.subcategory.category &&
      this.products.subcategory.category.name == 'Inmuebles')) {
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
    ${base_url}/${ROUTES.SHOPS.LINK}/${ROUTES.SHOPS.SHOW}/${id}`;
    window.open(
      url,
      '_blank');
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
   // dialogConfig.maxWidth = '896px';
    dialogConfig.width = '100%';
    dialogConfig.minWidth = '300px';
    dialogConfig.maxWidth = '900px';
    dialogConfig.minHeight = '494px';
   // dialogConfig.maxHeight = '90vh';
    dialogConfig.autoFocus = false;
   /* dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '300px';
    dialogConfig.maxWidth = '900px';
    dialogConfig.width = '55%';
    dialogConfig.autoFocus = false;*/

    const dialogRef = this.dialog.open(ModalFormRegisterComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
    });
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
    this.simulateSufi();
  }


  simulateSufi() {
    const creditValue = this.simulateForm.get('credit-value').value;
    const termMonths = this.simulateForm.get('term-months').value;
    const infoVehicle = {
      'productId': this.idProduct,
      'valorAFinanciar': this.products.price,
      'cuotaInicial': creditValue ? creditValue : 0,
      'plazo': termMonths
    };
    this.simulateCreditService.simulateCreditSufi(infoVehicle).then(response => {
      if(response && response.simulaciones) {
        this.tradicionalSimulacion = response.simulaciones[0];
        this.especialSimulacion = response.simulaciones[1];
      }
    })
      .catch(httpErrorResponse => { });
  }


}
