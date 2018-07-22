import {
  ChangeDetectorRef,
  ViewChild,
  Output,
  EventEmitter
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
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ShareInfoChatService } from '../chat-thread/shareInfoChat.service';

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
  public showInputShare: boolean;
  public messageSuccess: boolean;
  public messageError: boolean;
  public textError: boolean;
  public visitsNumber = 0;
  @Input() idProduct: number;
  @Input() readOnly: boolean = false;
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  public  showButtons = false;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private currentSessionSevice: CurrentSessionService,
    private userService: UserService,
    private messagesService: MessagesService,
    private shareInfoChatService: ShareInfoChatService
  ) {
    this.carouselConfig = CAROUSEL_CONFIG;
  }

  ngOnInit() {
    this.sendInfoProduct = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)])
    });

    this.loadProduct();
  }


  visitorCounter() {
    this.productsService.visitorCounter(this.products.id).subscribe((response) => {
      if (response.status == 0) {
        this.visitsNumber = response.body.visitas;
        this.changeDetectorRef.markForCheck();
      }
    }, (error) => {console.log(error); });
  }

  clickArrow() {
    this.changeDetectorRef.markForCheck();
  }

  shareProduct() {
    if (!this.sendInfoProduct.invalid) {
      const params = {
        product_id: this.products.id,
        email: this.sendInfoProduct.get('email').value
      };
      this.productsService
        .shareProduct(params)
        .then(response => {
          this.messageSuccess = true;
          this.sendInfoProduct.reset();
          this.gapush(
            'send',
            'event',
            'Productos',
            'ClicInferior',
            'CompartirEsteProductoExitoso'
          );
        })
        .catch(httpErrorResponse => {
          if (httpErrorResponse.status === 422) {
            this.textError = httpErrorResponse.error.errors[0].detail;
            this.messageError = true;
          }
        });
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

  sendMessage() {
    this.shareInfoChatService.setIdConversation(this.products.user.id);
    let photoUser;
    let company;
    if (this.products.user.photo) {
      if (!this.products.user.photo.url) {
        photoUser = undefined;
      } else {
        photoUser = this.products.user.photo.url;
      }
    }
    if (this.products.user.company) {
      if (!this.products.user.company.name) {
        company = undefined;
      } else {
        company = this.products.user.company.name;
      }
    }

    const newUser = {
      fotoEmisario: photoUser,
      idEmisario: Number(this.products.user.id),
      messages: [],
      nombreEmisario: this.products.user.name,
      inicioConversacion: true,
      numeroNotificacionesNoLeidas: 0,
      comunidad: company
    };
    this.shareInfoChatService.setNewConversation(newUser);
    this.router.navigate([
      `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.MESSAGES}`
    ]);
  }

  async loadProduct() {
    try {
      this.products = await this.productsService.getProductsById(
        this.idProduct
      );
      this.onLoadProduct(this.products);
      this.productIsSold(this.products);
      if (this.products.photos !== undefined) {
        this.productsPhotos = [].concat(this.products.photos);
        this.products.photos = this.productsPhotos;
      }
      if (this.products.photos) {
        this.conversation = {
          photo: this.products.photos[0].url,
          name: this.products.user.name
        };
      }
      this.productChecked = this.products.status;
      this.productStatus = this.products.status === 'active';
      this.visitorCounter();
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      if (error.status === 404) {
        this.redirectErrorPage();
      }
    }
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
    return 'url(' + this.products.user.photo.url + ')';
  }

  saveCheck() {
    this.productStatus = !this.productStatus;
    this.productStatus
    ? (this.productChecked = "active")
    : (this.productChecked = "inactive");
    const params = {
      estado: this.productStatus ? 'active' : 'inactive'
    };
    this.productsService
      .updateProductStatus(this.idUser, this.products.id, params)
      .then(response => {});
  }

  changeStatusBuy() {
    const params = {
      status: 'buying'
    };
    this.productsService
      .updateProduct(this.products.id, params)
      .then(response => {
        this.productsService.products = [];
      });
  }

  checkSufiBotton() {
    if (
      this.products &&
      this.products['type-vehicle'] &&
      this.products['model']
    ) {
      const priceVehicle = this.products.price;
      const currentUser = this.currentSessionSevice.currentUser();
      const countryId = Number(currentUser['countryId']);
      const type = this.products['type-vehicle'];
      const currentYear = new Date().getFullYear() + 1;
      const modelo = this.products['model'];
      const differenceYear = currentYear - modelo;
      if (
        this.products.subcategory.name === 'Carros' &&
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

  changeDate() {
    return (
      new Date(this.products['publish-until']) <
        new Date(new Date().toDateString()) ||
      this.products.status === 'expired'
    );
  }

  validateSession() {
    return this.products && this.products.user.id === this.idUser;
  }

  isSellProcess() {
    return this.products && this.products.status === 'sell_process';
  }

  isSold() {
    return this.products && this.products.status === 'sold';
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
    } catch (error) {}
  }

  editProduct(product: ProductInterface) {
    this.router.navigate([
      `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.UPLOAD}/${product.id}`
    ]);
  }

  getLocation(product): string {
    const city = product.user.city;
    const state = city.state;
    return `${city.name}, ${state.name}`;
  }

  buyProduct(id: number | string) {
    const urlBuyProduct = `${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.BUY
    }/${id}`;
    this.router.navigate([urlBuyProduct]);
  }

  async showBuyModal() {
    try {
      this.products = await this.productsService.getProductsById(
        this.idProduct
      );
      this.isModalBuyShowed = true;
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      console.log('Error: ', error);
    }
  }

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
    const userName = this.currentSessionSevice.currentUser().name;
    this.configModal = {
      emailVendedor: product.user.email,
      nombreVendedor: product.user.name,
      nombreOfertador: userName,
      idProducto: product.id,
      nombreProducto: product.name,
      photo: product.photos[0].url,
      price: product.price,
      type: product['sell-type']
    };
  }
}
