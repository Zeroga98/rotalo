import { Component, OnInit, Input } from '@angular/core';
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

@Component({
  selector: "detail-product",
  templateUrl: "./detail-product.component.html",
  styleUrls: ["./detail-product.component.scss"]
})
export class DetailProductComponent implements OnInit {
  public carouselConfig: NgxCarousel;
  public products: ProductInterface;
  public nameProducto: String;
  public productsPhotos: any;
  public productStatus: boolean;
  public productChecked: String;

  configModal: ModalInterface;
  isSufiModalShowed: boolean = false;
  isOfferModalShowed: boolean = false;
  idUser: string = this.currentSessionSevice.getIdUser();
  public conversation: ConversationInterface;
  @Input() idProduct: number ;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private currentSessionSevice: CurrentSessionService,
    private userService: UserService ) {
    this.carouselConfig = CAROUSEL_CONFIG;
  }

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct() {
    this.productsService.getProductsById(this.idProduct).then(product => {
      this.products = product;
      if (this.products.photos !== undefined) {
        this.productsPhotos = [].concat(this.products.photos);
        this.products.photos = this.productsPhotos;
      }
      this.productChecked = this.products.status;
      if (this.products.status === 'active') {
        this.productStatus = true;
      }else {
        this.productStatus = false;
      }
    /*  this.conversation = {
        photo: this.products.photos.url,
        name: this.products.photos.name
      };*/
    });
  }

  saveCheck()  {
    this.productStatus = !this.productStatus;
    this.productStatus ?  this.productChecked = 'active' : this.productChecked =  'inactive';

    const  params = {
      status: this.productStatus ? 'active' : 'inactive'
    };
    const productRequest = {
      'data': {
        id: this.products.id,
        'type': 'products',
        'attributes': params
      }
    };

    this.productsService.updateProduct(this.products.id, productRequest).then(response => {
    });
  }

  checkSufiBotton() {
    const type = "privado";
    const currentYear = (new Date()).getFullYear();
    const modelo = 2008;
    const differenceYear = currentYear - modelo;

    if (this.products.subcategory.id === "9" && differenceYear <= 10 && type === "privado") {
      return true;
    }
    return false;
  }

 changeDate() {
    return new Date((this.products['publish-until'])) < new Date(new Date().toDateString())
    || this.products.status === 'expired';
  }

  isSpinnerShow() {
    return this.products;
  }

  validateSession() {
    return (this.products.user.id === this.idUser);
  }

  async deleteProduct(product: ProductInterface) {
    try {
      const result = confirm('¿Seguro quieres borrar esta publicación?');
      if (!result) { return ; }
      this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`]);
      const response = await this.productsService.deleteProduct(product.id);
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

  openSufiModal(product: ProductInterface) {
    this.isSufiModalShowed = true;
    this.configurarModal(product);
  }

  openSimulateCreditSufi(id: number | string) {
    const urlSimulateCredit = `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SIMULATECREDIT}/${id}`;
    this.router.navigate([urlSimulateCredit]);
  }

  openOfferModal(product: ProductInterface) {
    this.isOfferModalShowed = true;
    this.configurarModal(product);
  }

  private configurarModal(product: ProductInterface) {
    this.configModal = {
      photo: product.photos[0].url,
      title: product.name,
      price: product.price,
      "product-id": product.id
    };
  }
}
