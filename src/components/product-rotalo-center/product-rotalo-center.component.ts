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
  selector: 'product-rotalo-center',
  templateUrl: './product-rotalo-center.component.html',
  styleUrls: ['./product-rotalo-center.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductRotaloCenterComponent implements AfterViewInit, AfterContentInit {
  @Input() product: ProductInterface;
  @Input() masonryInfo;
  @Input() showField: boolean;
  @Input() isProductSelling: boolean;
  @Input() expiredProduct: boolean;
  @Input() isProductSold: boolean;
  @Input() isProductPurchased: boolean;
  @Output() selected: EventEmitter<ProductInterface> = new EventEmitter();
  @Output() updateProducts:  EventEmitter<any> = new EventEmitter();
  @Input() colourCompany: string;
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

  constructor(
    private render: Renderer2,
    private productsService: ProductsService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private currentSessionSevice: CurrentSessionService,
    private modalService: ModalShareProductService,
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

  ngAfterContentInit() {
    this.productChecked = this.product.status;
    this.productStatus = this.product.status === 'active';
    this.changeDetectorRef.markForCheck();
  }

  ngAfterViewInit(): void {
    this.checkSizeCard();
  }

  triggerMasonryLayout() {
    if (this.masonryInfo) {
      this.masonryInfo.layout();
    }
  }

  get isActivePromo() {
    if (this.product['special-date'] && this.product['special-date'].active
    || this.product['specialDate'] && this.product['specialDate'].active) {
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
          this.product['publish-until'] = response.body.producto['publish-until'];
          this.changeDetectorRef.markForCheck();
        }
        this.changeDetectorRef.markForCheck();
      });
  }

  getLocation(product): string {
    if (product.city) {
      const city = product.city;
      const state = city.state;
      return `${city.name},  ${state.name}`;
    }
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
      this.changeDetectorRef.markForCheck();
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
    if (this.product.id) {
      this.modalService.setProductId(this.product.id);
      this.modalService.open(id);
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


}