import {
  ElementRef,
  AfterContentInit,
  AfterViewInit,
  Renderer2,
  ChangeDetectorRef
} from '@angular/core';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ROUTES } from '../../router/routes';
import { Router } from '@angular/router';
import { CurrentSessionService } from '../../services/current-session.service';
import { ModalShareProductService } from '../modal-shareProduct/modal-shareProduct.service';
import { NavigationService } from '../../pages/products/navigation.service';
import { START_DATE_BF, END_DATE_BF, START_DATE } from '../../commons/constants/dates-promos.contants';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements AfterViewInit, AfterContentInit {
  @Input() product: ProductInterface;
  @Input() masonryInfo;
  @Input() showField: boolean;
  @Input() isProductSelling: boolean;
  @Input() isProductChecked: boolean;
  @Input() expiredProduct: boolean;
  @Input() isProductSold: boolean;
  @Input() isProductPurchased: boolean;
  @Output() selected: EventEmitter<ProductInterface> = new EventEmitter();
  @Output() updateProducts: EventEmitter<any> = new EventEmitter();
  @Input() colourCompany: string;
  @Input() numberOrder = '';
  @Input() totalProducts = 5;
  @ViewChild('containerProducts', { read: ElementRef })
  containerProducts: ElementRef;

  readonly defaultImage: string = '../assets/img/product-no-image.png';
  private readonly limitSize: number = 220;
  public productStatus: boolean = false;
  public productChecked: String = 'active';
  public idUser: string = this.currentSessionSevice.getIdUser();
  public idCountry = 1;
  public startDateBf = START_DATE_BF;
  public startDate = START_DATE;
  public endDate = END_DATE_BF;
  public courrentDate = new Date();
  public starSelected = false;
  private status = '';
  public numbersOrder = ['1', '2', '3', '4', '5'];


  constructor(
    private render: Renderer2,
    private productsService: ProductsService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private currentSessionSevice: CurrentSessionService,
    private modalService: ModalShareProductService,
    private navigationService: NavigationService
  ) {
    let countryId;
    if (this.navigationService.getCurrentCountryId()) {
      countryId = this.navigationService.getCurrentCountryId();
    } else {
      countryId = this.currentSessionSevice.currentUser()['countryId'];
    }
  }

  ngAfterContentInit() {
    this.productChecked = this.product.status;
    this.checkStatusProduct();
    this.productStatus = this.product.status === 'active';
    if (this.product['product_manual_feature'] && !this.isProductChecked) {
      this.starSelected = true;
      this.productsService.countProductChecked(this.starSelected);
    }
    this.changeDetectorRef.markForCheck();
  }

  ngAfterViewInit(): void {
    this.checkSizeCard();
    this.getArrayOrderNumber();
  }

  getArrayOrderNumber() {
    if (this.totalProducts != 5) {
      const numbers: Array<any> = [];
      for (let i = 0; i < this.totalProducts; i++) {
        numbers.push( i + 1 );
      }
      this.numbersOrder = numbers;
    }
  }

  triggerMasonryLayout() {
    if (this.masonryInfo) {
      this.masonryInfo.layout();
    }
  }

  get isActivePromo() {
    if (
      (this.product['special-date'] && this.product['special-date'].active) ||
      (this.product['specialDate'] && this.product['specialDate'].active)
    ) {
      return true;
    }
    return false;
  }

  saveCheck() {
    this.productStatus = !this.productStatus;
    this.productStatus
      ? (this.productChecked = 'active')
      : (this.productChecked = 'inactive');
    const params = {
      estado: this.productStatus ? 'active' : 'inactive'
    };
    this.changeDetectorRef.markForCheck();
    this.productsService
      .updateProductStatus(this.idUser, this.product.id, params)
      .then(response => {
        if (response.status == '0') {
          this.product['published-at'] = response.body.producto['published-at'];
          this.product['publish-until'] =
            response.body.producto['publish-until'];
          this.changeDetectorRef.markForCheck();
        }
        this.changeDetectorRef.markForCheck();
      });
  }

  getLocation(product): string {
    // if (product.city) {
    //   const city = product.city;
    // const state = city.state;
    return `${product['product_city_name']},  ${product['product_state_name']}`;
    // }
  }
  selectProduct() {
    this.selected.emit(this.product);
  }
  updateSrc(evt) {
    evt.currentTarget.src = this.defaultImage;
  }

  async deleteProduct(product: ProductInterface) {
    try {
      const result = confirm('¿Seguro quieres borrar esta publicación?');
      if (!result) {
        return;
      }
      const response = await this.productsService.deleteProduct(product.id);
      this.updateProducts.emit(true);
      this.router.navigate([
        `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SELLING}`
      ]);
    } catch (error) {}
  }

  async removeMarkProduct(product: ProductInterface) {
    try {
      const result = confirm('¿Seguro quieres desmarcar esta publicación?');
      if (!result) {
        return;
      }
      const response = await this.productsService.removeMarkProduct(
        product['product_id']
      );
      this.updateProducts.emit(true);
      this.router.navigate([
        `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.FEATUREDPRODUCT}`
      ]);
    } catch (error) {}
  }

  editProduct(product: ProductInterface) {
    this.router.navigate([
      `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.UPLOAD}/${product.id}`
    ]);
  }

  republish(product: ProductInterface) {
    const param = {
      idProducto: product.id
    };
    this.productsService.republishService(param).subscribe(
      state => {
        this.router.navigate([
          `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.UPLOAD}/${product.id}`
        ]);
      },
      error => console.log(error)
    );
  }

  republishSold(product: ProductInterface) {
    const param = {
      idProducto: product.id
    };
    this.productsService.republishNewProduct(param).subscribe(
      state => {
        const idNew = state.body.idNuevoProducto;
        this.router.navigate([
          `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.UPLOAD}/${idNew}`
        ]);
      },
      error => console.log(error)
    );
  }

  private checkSizeCard() {
    setTimeout(() => {
      const elem = this.containerProducts.nativeElement;
      if (elem.offsetWidth <= this.limitSize) {
        this.render.addClass(elem, 'mini-card');
      }
    });
  }

  shareProduct(id: string) {
    if (this.product['product_id']) {
      this.modalService.setProductId(this.product['product_id']);
      this.modalService.open(id);
    }
  }

  get isPromoDate() {
    if (
      this.courrentDate >= this.startDateBf &&
      this.courrentDate <= this.endDate
    ) {
      return true;
    }
    return false;
  }

  get isPromoDateBefore() {
    if (
      this.courrentDate >= this.startDate &&
      this.courrentDate <= this.endDate
    ) {
      return true;
    }
    return false;
  }

  isSuperUser() {
    if (
      this.currentSessionSevice.currentUser()['rol'] &&
      this.currentSessionSevice.currentUser()['rol'] === 'superuser'
    ) {
      return true;
    }
    return false;
  }

  checkStar() {
    if (
      !this.starSelected &&
      this.productsService.getCounterProductChecked() < 5
    ) {
      this.starSelected = true;
      this.productsService
        .selectFeaturedProduct(this.product['product_id'], this.starSelected)
        .subscribe(
          response => {
            this.productsService.countProductChecked(true);
          },
          error => {
            if (error.error.status == '623') {
              alert(
                '¡Ups! Ya llegaste al límite de los 5 productos destacados.'
              );
              this.starSelected = false;
              this.changeDetectorRef.markForCheck();
            }
            console.log(error);
          }
        );
    } else if (this.starSelected) {
      this.starSelected = false;
      this.productsService
        .selectFeaturedProduct(this.product['product_id'], this.starSelected)
        .subscribe(
          response => {
            this.productsService.countProductChecked(this.starSelected);
          },
          error => {
            console.log(error);
          }
        );
    } else {
      alert('¡Ups! Ya llegaste al límite de los 5 productos destacados.');
    }
  }

  changeCheckProduct(event) {
    const id = event.target.value;
    const productParams = this.productsService.getCheckedProductArray().data;
    productParams.map(productParam => {
      if (this.product['product_id'] == productParam.productId) {
        productParam.posicion = Number(id);
      }
    });
    console.log(productParams);
  }

  checkStatusProduct() {
    switch (this.product['product_status']) {
      case 'expired':
        this.status = 'Expirado';
        break;
      case 'sell_process':
        this.status = 'En proceso de venta';
        break;
      case 'rejected':
        this.status = 'Rechazado';
        break;
      case 'auctioned':
        this.status = 'Subastado';
        break;
      case 'inactive':
        this.status = 'Inactivo';
        break;
      case 'negotiated':
        this.status = 'Negociado';
        break;
      case 'sold':
        this.status = 'Vendido';
        break;
      case 'purchased':
        this.status = 'Comprado';
        break;
      case 'completed':
        this.status = 'Completado';
        break;
      case 'accepted':
        this.status = 'Aceptado';
        break;
      default:
        this.status = '';
        break;
    }
  }



}
