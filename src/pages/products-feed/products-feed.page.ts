import { FeedService } from './feed.service';
import { CountryInterface } from './../../components/select-country/country.interface';
import { CityInterface } from './../../commons/interfaces/city.interface';
import { NavigationService } from './../products/navigation.service';
import { Router } from '@angular/router';
import { SubcategoryInterface } from './../../commons/interfaces/subcategory.interface';
import { CategoryInterface } from './../../commons/interfaces/category.interface';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import { Observable ,  Subscription } from 'rxjs';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  ViewChildren,
  QueryList,
  AfterViewInit
} from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { ProductsService } from '../../services/products.service';
import { IMGS_BANNER, IMGS_BANNER_GUATEMALA, IMGS_BANNER_BANCOLOMBIA, IMGS_BANNER_MOBILE } from '../../commons/constants/banner-imgs.contants';
import { CAROUSEL_CONFIG } from './carousel.config';
import { ROUTES } from './../../router/routes';
import { StatesRequestEnum } from '../../commons/states-request.enum';
import { UtilsService } from '../../util/utils.service';
import { MASONRY_CONFIG } from './masonry.config';
import { setTimeout } from 'timers';
import { CurrentSessionService } from '../../services/current-session.service';
import { LoginService } from '../../services/login/login.service';
import { ModalShareProductService } from '../../components/modal-shareProduct/modal-shareProduct.service';
import { ModalTicketService } from '../../components/modal-ticket/modal-ticket.service';
import { UserService } from '../../services/user.service';
import {
  IMGS_BANNER_PROMO,
  IMGS_BANNER_PROMO_BANCOLOMBIA,
  IMGS_BANNER_GUATEMALA_PROMO
} from '../../commons/constants/banner-imgs-promo.constants';
import { CAROUSEL_PRODUCTS_CONFIG } from './carouselProducts.config';
import { START_DATE_BF, END_DATE_BF, START_DATE } from '../../commons/constants/dates-promos.contants';
import { NavigationTopService } from '../../components/navigation-top/navigation-top.service';
import { SettingsService } from '../../services/settings.service';
import { debug } from 'util';


@Component({
  selector: 'products-feed',
  templateUrl: 'products-feed.page.html',
  styleUrls: ['products-feed.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsFeedPage implements OnInit, OnDestroy, AfterViewInit {
  public carouselConfig: NgxCarousel;
  public carouselProductsConfig: NgxCarousel;
  public masonryConfig = MASONRY_CONFIG;
  public imagesBanner: Array<string>;
  public imagesBannerMobile: Array<string>;
  public products: Array<ProductInterface> = [];
  public configFiltersSubcategory: Object;
  private _subscriptionCountryChanges: Subscription;
  private currentPage: number = 1;
  private waitNewPage: boolean = false;
  public showBanner = true;
  public countrySelected: CountryInterface;
  isInfiniteScrollDisabled: boolean = true;
  statesRequestEnum = StatesRequestEnum;
  stateRequest: StatesRequestEnum = this.statesRequestEnum.loading;
  private currentFilter: Object;
  @ViewChild('backTop', { read: ElementRef })
  backTop: ElementRef;
  @ViewChild('masonryRef') masonryRef: any;
  private userId = this.currentSession.getIdUser();
  public showAnyProductsMessage = false;
  public featuredproducts: Array<ProductInterface> = [];
  public groupFeaturedProducts:  Array<any> = [];
  public couponService;
  public community: any;
  readonly defaultImage: string = '../assets/img/product-no-image.png';
  private currentUrl = '';
  public pageNumber: number = 1;
  public totalPages: number = 100;
  @ViewChildren('productsEnd') endForRender: QueryList<any>;
  public  showPagination = false;
  public idCountry = 1;
  public startDateBf = START_DATE_BF;
  public startDate = START_DATE;
  public endDate = END_DATE_BF;
  public courrentDate = new Date();
  public showBannerToShop;
  public productsBancolombia: Array<ProductInterface> = [];
  public currentUser;
  public showBancolombiaProducts = false;


  constructor(
    private productsService: ProductsService,
    private rendered: Renderer2,
    private router: Router,
    private utilService: UtilsService,
    private navigationService: NavigationService,
    private feedService: FeedService,
    private changeDetectorRef: ChangeDetectorRef,
    private currentSession: CurrentSessionService,
    private loginService: LoginService,
    private modalService: ModalShareProductService,
    private modalTicketService: ModalTicketService,
    private userService: UserService,
    private navigationTopService: NavigationTopService,
    private settingsService: SettingsService
  ) {
    this.currentFilter = this.feedService.getCurrentFilter();
    this.configFiltersSubcategory = this.feedService.getConfigFiltersSubcategory();
    this.showBanner = this.configFiltersSubcategory === undefined;
    this.carouselConfig = CAROUSEL_CONFIG;
    this.carouselProductsConfig = CAROUSEL_PRODUCTS_CONFIG;

    this.loadBancolombiaProduct();
  }

   ngOnInit() {
    let countryId;
    if (this.navigationService.getCurrentCountryId()) {
      countryId = this.navigationService.getCurrentCountryId();
    } else {
      countryId = this.currentSession.currentUser()['countryId'];
    }

    this.idCountry = countryId;
    this.loadProductsUser(countryId);
    this._subscribeCountryChanges();
    this.communitySubscription();
    this.searchSubscription();
    this.loadInfoUser();
  }

  ngOnDestroy(): void {
    this.productsService.setCounterProductChecked(0);
    this._subscriptionCountryChanges.unsubscribe();
    this.changeDetectorRef.markForCheck();
  }

  ngAfterViewInit() {
    this.showPagination = true;
    if (this.productsService.products.length > 0) {
      // this.endForRender.notifyOnChanges();
      this.endForRender.changes.subscribe(t => {
        this.ngForRender();
        this.changeDetectorRef.markForCheck();
      });
      this.endForRender.notifyOnChanges();
    }
    this.changeDetectorRef.markForCheck();
  }

  ngForRender() {
    this.productsService.products = [];
    this.productsService.getProductLocation();
    this.changeDetectorRef.markForCheck();
  }

  loadBanners() {
    this.settingsService.getBannersHomeList().subscribe(response => {
      if (response.body) {
        this.imagesBanner = response.body.banners;
        this.imagesBanner = this.imagesBanner.filter((image) =>{
         return image['url-photo-desktop'].includes('buro') && this.currentUser
            && this.currentUser.city && (this.currentUser.city.state.id == 11 || this.currentUser.city.state.id == 3)
            || !image['url-photo-desktop'].includes('buro');
          });
        this.currentUrl = window.location.href;
        if (this.currentUrl.includes('gt')) {
          this.showBannerToShop = false;
        } else {
          this.showBannerToShop = true;
        }
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  async loadInfoUser() {
    try {
      this.currentUser = await this.userService.getInfoUser();
      this.currentUser && this.currentUser.company.community && this.currentUser.company.community.name == 'Bancolombia' ?
      this.showBancolombiaProducts = true : this.showBancolombiaProducts = false;
      this.loadBanners();
    } catch (error) {
      if (error.status === 404) {
        console.log(error);
      }
    }
  }

  loadBancolombiaProduct() {
    if (!this.productsService.getBancolombiaProducts()) {
      this.productsService.bancolombiaProduct().subscribe(
        (response) => {
          if (response.body) {
          this.productsBancolombia = response.body.productos;
          this.productsService.setBancolombiaProducts(this.productsBancolombia);
          this.changeDetectorRef.markForCheck();
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.productsBancolombia = this.productsService.getBancolombiaProducts();
      this.changeDetectorRef.markForCheck();
    }
  }

  loadFeaturedProduct(countryId, communityId) {
    if (!this.productsService.getFeatureProducts()) {
      this.productsService.featuredProduct(countryId, communityId).subscribe(
        (response) => {
          if (response.body) {
          this.featuredproducts = response.body.productos;
         // this.groupFeaturedProducts = this.chunkArray(this.featuredproducts, 5);
          this.productsService.setFeatureProducts(this.featuredproducts);
          this.changeDetectorRef.markForCheck();
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.featuredproducts = this.productsService.getFeatureProducts();
      this.changeDetectorRef.markForCheck();
    }
  }

  chunkArray(myArray, chunk_size) {
    const results = [];
    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }
    return results;
  }

  updateSrc(evt) {
    evt.currentTarget.src = this.defaultImage;
  }

  getLocation(product): string {
    const city = product.city;
    const state = city.state;
    return `${city.name}, ${state.name}`;
  }

  isSuperUser() {
    if (this.currentSession.currentUser()['rol']) {
      if (this.currentSession.currentUser()['rol'] === 'superuser') {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  loadProductsUser(countryId) {
    this.countrySelected = { id: countryId };
    this.currentFilter = Object.assign({}, this.currentFilter, {
      'product_country_id' : countryId,
      'size': 24,
      'number': 1
    });
    this.loadFeaturedProduct(countryId, -1);
    this.feedService.setCurrentFilter(this.currentFilter);
    const params = this.getParamsToProducts();
    this.loadProducts(params);
  }

  LeerDatos(): Observable<Response> {
    // Se declara cómo va a ser la llamada
    // ocultando los pormenores a los consumidores
    return
    // En este momento aún no se efectuó la llamada
  }

  async loadProducts(params: Object = {}) {
    try {
      this.stateRequest = this.statesRequestEnum.loading;
      this.isInfiniteScrollDisabled = true;
      if (this.productsService.products.length > 0) {
        this.products = this.productsService.products;
        this.currentPage = this.productsService.currentPage;
        this.pageNumber = this.currentPage;
        this.changeDetectorRef.markForCheck();
      } else {
        let products;
        products = await this.productsService.loadProducts(params);
        this.updateProducts(products);
      }
      this.totalPages = this.productsService.getTotalProducts();
      this.stateRequest = this.statesRequestEnum.success;
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      this.stateRequest = this.statesRequestEnum.error;
      this.changeDetectorRef.markForCheck();
    }

    if (this.products.length <= 0) {
      this.showAnyProductsMessage = true;
    } else {
      this.showAnyProductsMessage = false;
    }
    this.changeDetectorRef.markForCheck();
  }

  setScroll(event) {
    this.productsService.setProductLocation(this.products, event['product_id'], this.currentPage);
  }

  setScrollSuperUser(event) {
    this.productsService.setProductLocation(this.products, event['id'], this.currentPage);
  }

  getParamsToProducts() {
    return this.currentFilter;
  }


  searchSubscription() {
    this.navigationTopService.currentEventSearch.subscribe(event => {
     if (event != null || event!= undefined) {
        this.searchByTags(event);
     }
    });
  }

  searchByTags(evt) {
    if (evt) {
      const filterValue = evt;
      this.setconfigFiltersSubcategory(null);
      delete this.currentFilter['product_subcategory_id'];
      delete this.currentFilter['product_category_id'];
      this.routineUpdateProducts({
        'product_name':  filterValue
      });
      this.showBanner = false;
    } else {
      if (this.currentFilter['product_subcategory_id'] || this.currentFilter['product_category_id']) {
        delete this.currentFilter['product_name'];
      } else {
        this.currentFilter = {
          'product_country_id': 1,
          'size': 24,
          'number': 1
        };
      }
      this.routineUpdateProducts({});
      this.showBanner = true;
    }
  }

  filteBySellType(sellType: string) {
    this.routineUpdateProducts({ 'product_sell_type': sellType.toUpperCase() });
  }

  filterBySort(sort: string) {
    this.routineUpdateProducts({ sort });
  }

  filterByState(state) {
    this.routineUpdateProducts({ 'product_state_id': state.id });
  }

  filterByCity(city: CityInterface) {
    this.routineUpdateProducts({
      'product_city_id': city.id,
      'product_state_id': undefined
    });
  }

  getPage(page: number) {
    this.pageNumber = page;
    this.routineUpdateProducts(
      { 'number': page },
      page
    );
    this.productsService.scroll = 0;
    window.scrollTo(0, 0);
  }


  communitySubscription() {
    this.navigationTopService.currentEventCommunity.subscribe(event => {
      if (event) {
        this.changeCommunity(event);
      }
    });
  }

  changeCommunity(community: any) {
    this.loadFeaturedProduct(this.countrySelected.id, community.id);
      if (community.id == -1) {
        delete this.currentFilter['seller_community_id'];
        this.routineUpdateProducts({});
      } else {
        this.routineUpdateProducts({ 'seller_community_id': community.id });
      }
  }


  selectProduct(product: ProductInterface) {
    const routeDetailProduct = `${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.SHOW
      }/${product['product_id']}`;
    this.router.navigate([routeDetailProduct]);
  }

  selectProductSuperUser(product: ProductInterface, event) {
    if (event.ctrlKey) {
      const url =  `${location.origin}/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${product['id']}`;
      window.open(url, '_blank');
    } else {
      const routeDetailProduct = `${ROUTES.PRODUCTS.LINK}/${
        ROUTES.PRODUCTS.SHOW
        }/${product['id']}`;
      this.router.navigate([routeDetailProduct]);
    }
  }

  getUrlProduct(product: ProductInterface) {
    const routeDetailProduct = `../../${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.SHOW
      }/${product['id']}`;
    return routeDetailProduct;
  }


  get isSpinnerShow(): boolean {
    return this.stateRequest == this.statesRequestEnum.loading;
  }

  get noExistProducts(): boolean {
    return this.products.length <= 0;
  }

  private _subscribeCountryChanges() {
    this._subscriptionCountryChanges = this.navigationService.countryChanged.subscribe(
      (country: any) => {
        this.countrySelected = { id: country.id };
        this.setconfigFiltersSubcategory(null);
        this.showBanner = true;
        this.currentFilter = this.feedService.getInitialFilter();
        this.feedService.setConfigFiltersSubcategory(this.currentFilter);
        this.routineUpdateProducts({ 'product_country_id': country.id });
      }
    );
  }

  private updateProducts(newProducts: Array<ProductInterface>) {
    this.waitNewPage
      ? this.addNewPage(newProducts)
      : (this.products = [].concat(newProducts));
    this.waitNewPage = false;
  }

  addNewPage(newProducts) {
    newProducts.forEach(product => this.products.push(product));
  }

  private routineUpdateProducts(filter: Object = {}, numberPage = 1) {
    this.isInfiniteScrollDisabled = true;
    filter = Object.assign({}, filter, this.getPageFilter(numberPage));
    const newFilter = this.updateCurrentFilter(filter);
    this.loadProducts(newFilter);
  }

  private getPageFilter(numberPage = 1) {
    this.currentPage = numberPage;
    return { 'number': numberPage };
  }

  private updateCurrentFilter(filter = {}) {
    this.currentFilter = Object.assign({}, this.currentFilter, filter);
    this.currentFilter = this.utilService.removeEmptyValues(this.currentFilter);
    this.feedService.setCurrentFilter(this.currentFilter);
    return this.currentFilter;
  }


  private setconfigFiltersSubcategory(filter) {
    this.configFiltersSubcategory = filter;
    this.feedService.setConfigFiltersSubcategory(this.configFiltersSubcategory);
  }


  public shareProduct(id: string, product) {
    if (product.id) {
      this.modalService.setProductId(product.id);
      this.modalService.open(id);
    }
  }


  public openModalCupon (imageUrl, id: string) {
  }

  public redirectPromo (imageUrl) {
  }

  public getCoupon (email, id: string) {
    this.modalTicketService.getCoupon(email).subscribe((response) => {
      this.couponService = response.body.cupon;
      this.modalTicketService.open(id);
      this.changeDetectorRef.markForCheck();
    },
    (error) => {console.log(error); } );
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

  isActivePromo(product) {
    if (product['special-date'] && product['special-date'].active
    || product['specialDate'] && product['specialDate'].active) {
      return true;
    }
    return false;
  }

  goToBancolombiaShop() {
    window.scroll(0, 0);
    this.gapush(
      'send',
      'event',
      'Home',
      'ClicBanner',
      'Tiendas'
    );
    const routeBancolombiaShop =  `${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.FEED}`;
    this.router.navigate([routeBancolombiaShop]);
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

  rightClickNewTab (product: ProductInterface, event) {
    if (event.ctrlKey) {
      const url =  `${location.origin}/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${product['id']}`;
      window.open(url, '_blank');
    }
  }

}
