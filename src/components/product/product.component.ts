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
  ViewChild,
  OnInit
} from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ROUTES } from '../../router/routes';
import { Router } from '@angular/router';
import { CurrentSessionService } from '../../services/current-session.service';
import { ModalShareProductService } from '../modal-shareProduct/modal-shareProduct.service';
import { NavigationService } from '../../pages/products/navigation.service';
import { START_DATE_BF, END_DATE_BF, START_DATE } from '../../commons/constants/dates-promos.contants';
import { ModalDeleteProductComponent } from '../modal-delete-product/modal-delete-product.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Validators, FormBuilder, AbstractControl, FormGroup } from '@angular/forms';
import { LikeDataSharingService } from '../../services/like-data-sharing.service';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements AfterViewInit, AfterContentInit {
  @Input() product;
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
  @Input() rotando: boolean;

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
  public likeSelected = false;
  private status = '';
  public numbersOrder = ['1', '2', '3', '4', '5'];
  public detailOrder = `../../${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.DETAILORDERS}/`;
  private likeDataSharingService: LikeDataSharingService;
  constructor(
    public dialog: MatDialog,
    private render: Renderer2,
    private productsService: ProductsService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private currentSessionSevice: CurrentSessionService,
    private modalService: ModalShareProductService,
    private navigationService: NavigationService,
    private _likeDataSharingService: LikeDataSharingService
  ) {
    this.likeDataSharingService = _likeDataSharingService;
    let countryId;
    if (this.navigationService.getCurrentCountryId()) {
      countryId = this.navigationService.getCurrentCountryId();
    } else {
      countryId = this.currentSessionSevice.currentUser()['countryId'];
    }
  }


  ngOnInit() {
    this.likeDataSharingService.likeProductObservable.subscribe(producto => {
        if(this.product.product_id == producto['idProducto']){

          this.likeSelected = producto['like'];
          this.product['product_likes'] = producto['likes'];
          this.changeDetectorRef.markForCheck();
      }

    });
  }

  ngAfterContentInit() {
    this.productChecked = this.product.status;
    this.checkStatusProduct();
    if (this.product.status) {
      this.productStatus = this.product.status === 'active';
    } else if (this.product['product_status']) {
      this.productStatus = this.product['product_status'] === 'active';
    }
    if (this.product['product_manual_feature'] && !this.isProductChecked) {
      this.starSelected = true;
    }
    if (this.product['product_like']) {
      this.likeSelected = true;
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
        numbers.push(i + 1);
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

  get isCostume () {
    if ((this.product['product_subcategory_id'] &&
    (this.product['product_subcategory_id'] == 127))) {
      return true;
    }
    return false;
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
      productId: this.product['product_id']
    }
    dialogConfig.data = option;
    const dialogRef = this.dialog.open(ModalDeleteProductComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result == 'delete_done') {
        this.updateProducts.emit(true);
        this.router.navigate([
          `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SELLING}`
        ]);
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
      this.saveCheck();
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.minWidth = '300px';
      dialogConfig.maxWidth = '900px';
      dialogConfig.width = '55%';
      dialogConfig.autoFocus = false;
      const option = {
        action: 'update',
        productId: this.product['product_id'],
        estado: this.productStatus ? (this.productChecked = 'inactive') : (this.productChecked = 'active')
      }
      dialogConfig.data = option;
      const dialogRef = this.dialog.open(ModalDeleteProductComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.action && result.action == 'update_done') {
          this.productStatus = !this.productStatus;
          this.productStatus ? (this.productChecked = 'active') : (this.productChecked = 'inactive');
          this.product['product_published_at'] = result.publishAt;
          this.product['product_publish_until'] = result.publishUntil;
          this.changeDetectorRef.markForCheck();
        }
        let gaPushParam = 'VendiRotaloExitoso';
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

  saveCheck() {
    let productId;
    if (this.product.id) {
      productId = this.product.id;
    } else if (this.product['product_id']) {
      productId = this.product['product_id'];
    }
    this.productStatus = !this.productStatus;
    this.productStatus
      ? (this.productChecked = 'active')
      : (this.productChecked = 'inactive');
    const params = {
      estado: this.productStatus ? 'active' : 'inactive'
    };
    this.changeDetectorRef.markForCheck();
    this.productsService
      .updateProductStatus(productId, params)
      .then(response => {
        if (response.status == '0') {
          this.product['product_published_at'] = response.body.producto['published-at'];
          this.product['product_publish_until'] =
            response.body.producto['publish-until'];
          this.changeDetectorRef.markForCheck();
        }
        this.changeDetectorRef.markForCheck();
      });
  }


  getLocation(product): string {
    return `${product['product_city_name']},  ${product['product_state_name']}`;
  }

  selectProduct(event) {
    if (event.ctrlKey) {
      const url = `${location.origin}/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${this.product['product_id']}`;
      window.open(url, '_blank');
    } else {
      this.selected.emit(this.product);
    }
  }

  getUrlProduct(product: ProductInterface) {
    const routeDetailProduct = `../../${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.SHOW
      }/${product['product_id']}`;
    return routeDetailProduct;
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
      let productId;
      if (product.id) {
        productId = product.id;
      } else if (product['product_id']) {
        productId = product['product_id'];
      }
      const response = await this.productsService.deleteProduct(productId);
      this.updateProducts.emit(true);
      this.router.navigate([
        `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SELLING}`
      ]);
    } catch (error) { }
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
    } catch (error) { }
  }

  editProduct(product: ProductInterface) {
    if (product.id) {
      this.router.navigate([
        `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.UPLOAD}/${product.id}`
      ]);
    } else if (product['product_id']) {
      this.router.navigate([
        `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.UPLOAD}/${product['product_id']}`
      ]);
    }
  }

  republish(product) {
    let productId;
    if (product.id) {
      productId = product.id;
    } else if (product['product_id']) {
      productId = product['product_id'];
    }
    const param = {
      idProducto: productId
    };
    this.productsService.republishService(param).subscribe(
      state => {
        this.router.navigate([
          `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.UPLOAD}/${productId}`
        ]);
      },
      error => console.log(error)
    );
  }

  republishSold(product) {
    let productId;
    if (product.id) {
      productId = product.id;
    } else if (product['product_id']) {
      productId = product['product_id'];
    }
    const param = {
      idProducto: productId
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
    if (!this.starSelected) {
      this.starSelected = true;
      this.productsService
        .selectFeaturedProduct(this.product['product_id'], this.starSelected)
        .subscribe(
          response => {
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
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  checkLike() {
    const params = {
      idProducto: this.product['product_id'],
      idTienda: this.product['seller_store_id']
    };

    if (!this.likeSelected) {
      this.likeSelected = true;
      this.productsService
        .selectLikeProduct(params)
        .subscribe(
          response => {
            if (response.body) {
              this.likeSelected = response.body.like;
              this.product['product_likes'] = response.body.likes;
              this.changeDetectorRef.markForCheck();
              this.likeDataSharingService.updateLikeProduct(response.body);
            }
          },
          error => {
            this.likeSelected = false;
            console.log(error);
          }
        );
    } else if (this.likeSelected) {
      this.likeSelected = false;
      this.productsService
        .selectLikeProduct(params)
        .subscribe(
          response => {
            if (response.body) {
              this.likeSelected = response.body.like;
              this.product['product_likes'] = response.body.likes;
              this.changeDetectorRef.markForCheck();
              this.likeDataSharingService.updateLikeProduct(response.body);
            }
          },
          error => {
            console.log(error);
          }
        );
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

  goToDetail(product: ProductInterface) {
    if (this.rotando) {
      if (product.id) {
        this.router.navigate([
          `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${product.id}`
        ]);
      } else if (product['product_id']) {
        this.router.navigate([
          `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${product['product_id']}`
        ]);
      }
    }
  }

  kFormatter() {
    if (this.product['product_likes']) {
      return Math.abs(this.product['product_likes']) > 9999 ?
      // ((Math.abs(this.product['product_likes']) / 1000))  + 'K +' :
      '10K +' :
       this.product['product_likes'];
    }
  }


}
