import { FeedService } from './feed.service';
import { CountryInterface } from './../../components/select-country/country.interface';
import { CityInterface } from './../../commons/interfaces/city.interface';
import { NavigationService } from './../products/navigation.service';
import { Router } from '@angular/router';
import { SubcategoryInterface } from './../../commons/interfaces/subcategory.interface';
import { CategoryInterface } from './../../commons/interfaces/category.interface';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import { Observable } from 'rxjs/Observable';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter
} from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { ProductsService } from '../../services/products.service';
import { IMGS_BANNER } from '../../commons/constants/banner-imgs.contants';
import { CAROUSEL_CONFIG } from './carousel.config';
import { ROUTES } from './../../router/routes';
import { Subscription } from 'rxjs';
import { StatesRequestEnum } from '../../commons/states-request.enum';
import { UtilsService } from '../../util/utils.service';
import { MASONRY_CONFIG } from './masonry.config';
import { setTimeout } from 'timers';
import { CurrentSessionService } from '../../services/current-session.service';
import { LoginService } from '../../services/login/login.service';
import { ModalShareProductService } from '../../components/modal-shareProduct/modal-shareProduct.service';
import { ModalTicketService } from '../../components/modal-ticket/modal-ticket.service';
import { UserService } from '../../services/user.service';
import { IMGS_BANNER_PROMO } from '../../commons/constants/banner-imgs-promo.constants';
import { CAROUSEL_PRODUCTS_CONFIG } from './carouselProducts.config';


@Component({
  selector: 'products-feed',
  templateUrl: 'products-feed.page.html',
  styleUrls: ['products-feed.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsFeedPage implements OnInit, OnDestroy {
  public carouselConfig: NgxCarousel;
  public carouselProductsConfig: NgxCarousel;
  public masonryConfig = MASONRY_CONFIG;
  public imagesBanner: Array<string>;
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
  readonly defaultImage: string = "../assets/img/product-no-image.png";
  private currentUrl = '';
  public pageNumber: number = 1;
  public totalPages: number = 100;
  public contador = 0;
  collection = [];


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
  ) {
    this.currentFilter = this.feedService.getCurrentFilter();
    this.configFiltersSubcategory = this.feedService.getConfigFiltersSubcategory();
    this.showBanner = this.configFiltersSubcategory === undefined;
    this.carouselConfig = CAROUSEL_CONFIG;
    this.carouselProductsConfig = CAROUSEL_PRODUCTS_CONFIG;
    this.imagesBanner = IMGS_BANNER_PROMO;

    /*Promo fecha determinada para cierta comunidad*/
  // this.addPromoBanner();
    this.addPromoBannerColombia();
  }

   ngOnInit() {
    let countryId;
    if (this.navigationService.getCurrentCountryId()) {
      countryId = this.navigationService.getCurrentCountryId();
    }else {
      countryId = this.currentSession.currentUser()['countryId'];
    }
    this.loadProductsUser(countryId);
    this._subscribeCountryChanges();
    // this.setScrollEvent();
  }

  ngOnDestroy(): void {
    this._subscriptionCountryChanges.unsubscribe();
    this.changeDetectorRef.markForCheck();
  }

  ngForEnd(lastItem) {
    console.log(this.contador);
    this.contador++;
    if (lastItem) {
      this.productsService.products = [];
      this.productsService.getProductLocation();
    }
  }

  /*async addPromoBanner() {
    this.community = await this.userService.getCommunityUser();
    if (this.community && this.community.name === 'Grupo Bancolombia') {
      this.imagesBanner = IMGS_BANNER_PROMO;
    }
  }*/

  addPromoBannerColombia() {
    this.currentUrl = window.location.href;
    if (this.currentUrl.includes('gt')) {
      this.imagesBanner = IMGS_BANNER;
    }else {
      this.imagesBanner = IMGS_BANNER_PROMO;
    }
  }

  loadFeaturedProduct(countryId, communityId) {
    this.productsService.featuredProduct(countryId, communityId).subscribe(
      (response) => {
        if (response.body) {
        this.featuredproducts = response.body.productos;
        this.groupFeaturedProducts = this.chunkArray(this.featuredproducts, 5);
        this.changeDetectorRef.markForCheck();
        }
      },
      (error) => {
        console.log(error);
      }
    );
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
    const city = product.user.city;
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
    if (this.isSuperUser()) {
      this.currentFilter = {
        'pais': countryId,
        'comunidad': -1,
        'cantidad': 3,
        'pagina': 1
      };
      this.loadFeaturedProduct(countryId, -1);
    }else {
      this.currentFilter = Object.assign({}, this.currentFilter, {
        'filter[country]': countryId,
        'page[size]': 24,
        'page[number]': 1
      });
      this.loadFeaturedProduct(countryId, this.currentFilter['filter[community]']);
    }

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
        if (this.isSuperUser()) {
          products = await this.productsService.getProductsSuper(this.userId, params);
        }else {
          products = await this.productsService.getProducts(params);
        }
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
    }else {
      this.showAnyProductsMessage = false;
    }
    this.changeDetectorRef.markForCheck();
  }

  setScroll(event) {
    this.productsService.setProductLocation(this.products, event.id, this.currentPage);
  }

  getParamsToProducts() {
    return this.currentFilter;
  }

  searchByTags(evt: Array<string>) {
    if (evt.length > 0) {
      const filterValue = evt.join('+');
      this.setconfigFiltersSubcategory(null);
      this.routineUpdateProducts({
        'filter[search]': filterValue,
        'filter[subcategory_id]': undefined,
        'filter[category]': undefined
      });
      this.showBanner = false;
    } else {
      if (this.currentFilter['filter[subcategory_id]'] || this.currentFilter['filter[category]']) {
        delete this.currentFilter['filter[search]'];
      }else {
        this.currentFilter = {
          'filter[status]': 'active',
          'filter[country]': 1,
          'filter[community]': -1,
          'page[size]': 8,
          'page[number]': 1,
          'filter[search]': null
        };
      }
      this.routineUpdateProducts({});
      this.showBanner = true;
    }
  }

  filteBySellType(sellType: string) {
    this.routineUpdateProducts({ 'filter[sell_type]': sellType.toUpperCase() });
  }

  filterBySort(sort: string) {
    this.routineUpdateProducts({ sort });
  }

  filterByState(state) {
    this.routineUpdateProducts({ 'filter[state]': state.id });
  }

  filterByCity(city: CityInterface) {
    this.routineUpdateProducts({
      'filter[city]': city.id,
      'filter[state]': undefined
    });
  }

  getPage(page: number) {
    this.pageNumber = page;
    if (this.isSuperUser()) {
      this.routineUpdateProducts(
        { 'pagina': page },
        page
      );
    }else {
      this.routineUpdateProducts(
        { 'page[number]': page },
        page
      );
    }
    this.productsService.scroll = 0;
    window.scrollTo(0, 0);
  }

  changeCommunity(community: any) {
    if (this.isSuperUser()) {
      this.loadFeaturedProduct(this.countrySelected.id, community.id);
      this.routineUpdateProducts({ 'comunidad': community.id });
    }else {
      this.loadFeaturedProduct(this.countrySelected.id, community.id);
      this.routineUpdateProducts({ 'filter[community]': community.id });
    }
  }

  selectedCategory(category: CategoryInterface) {
    this.setconfigFiltersSubcategory({
      category: category.name,
      subCategory: undefined,
      color: category.color,
      icon: category.icon
    });
    this.routineUpdateProducts({
      'filter[category]': category.id,
      'filter[subcategory_id]': undefined
    });
  }

  selectProduct(product: ProductInterface) {
    const routeDetailProduct = `${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.SHOW
      }/${product.id}`;
    this.router.navigate([routeDetailProduct]);
  }

  selectedSubCategory(subCategory: SubcategoryInterface) {
    this.setconfigFiltersSubcategory({
      category: subCategory.category.name,
      subCategory: subCategory.name,
      color: subCategory.category.color,
      icon: subCategory.category.icon
    });
    this.routineUpdateProducts({
      'filter[subcategory_id]': subCategory.id,
      'filter[category]': undefined
    });
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
        this.routineUpdateProducts({ 'filter[country]': country.id });
      }
    );
  }

  private updateProducts(newProducts: Array<ProductInterface>) {
    this.waitNewPage
      ? this.addNewPage(newProducts)
      : (this.products = [].concat(newProducts));
    this.waitNewPage = false;
   // this.updateMasonry();
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
    if (this.isSuperUser()) {
      return {'pagina': numberPage };
    }
    return { 'page[number]': numberPage };
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

  public isExclusiveOffer(imageUrl) {
    if (imageUrl.includes('banner_10')) {
      return true;
    }
    return false;
  }

  public openModalCupon (imageUrl, id: string) {
    if (this.isExclusiveOffer(imageUrl)) {
      const currentUser = this.currentSession.currentUser();
      if (currentUser) {
        const emailObject = {
          'correo' : currentUser.email
        };
        this.getCoupon (emailObject, id);
      }
    }
  }

  public getCoupon (email, id: string) {
    this.modalTicketService.getCoupon(email).subscribe((response) => {
      this.couponService = response.body.cupon;
      this.modalTicketService.open(id);
      this.changeDetectorRef.markForCheck();
    },
    (error) => {console.log(error); } );
  }


}
