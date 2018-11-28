import { FeedMicrositeService } from './feedMicrosite.service';
import { CountryInterface } from './../../../components/select-country/country.interface';
import { CityInterface } from './../../../commons/interfaces/city.interface';
import { NavigationService } from '../../../pages/products/navigation.service';
import { Router } from '@angular/router';
import { SubcategoryInterface } from './../../../commons/interfaces/subcategory.interface';
import { CategoryInterface } from './../../../commons/interfaces/category.interface';
import { ProductInterface } from './../../../commons/interfaces/product.interface';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  AfterViewInit
} from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { ProductsMicrositeService } from '../../services-microsite/back/products-microsite.service'
import { ROUTES } from './../../../router/routes';
import { Subscription } from 'rxjs';
import { StatesRequestEnum } from '../../../commons/states-request.enum';
import { UtilsService } from '../../../util/utils.service';
import { CurrentSessionService } from '../../../services/current-session.service';
import { ModalShareProductService } from '../../../components/modal-shareProduct/modal-shareProduct.service';
import { ModalTicketService } from '../../../components/modal-ticket/modal-ticket.service';


@Component({
  selector: 'products--microsite',
  templateUrl: 'products-microsite.page.html',
  styleUrls: ['products-microsite.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsMicrositePage implements OnInit, OnDestroy, AfterViewInit {
  public carouselConfig: NgxCarousel;
  public carouselProductsConfig: NgxCarousel;
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
  private userId = this.currentSession.getIdUser();
  public showAnyProductsMessage = false;
  public featuredproducts: Array<ProductInterface> = [];
  public groupFeaturedProducts: Array<any> = [];
  public couponService;
  public community: any;
  readonly defaultImage: string = '../assets/img/product-no-image.png';
  private currentUrl = '';
  public pageNumber: number = 1;
  public totalPages: number = 100;
  @ViewChildren('productsEnd') endForRender: QueryList<any>;
  public showPagination = false;
  public idCountry = 1;
  public counter = '';
  constructor(
    private productsService: ProductsMicrositeService,
    private router: Router,
    private utilService: UtilsService,
    private navigationService: NavigationService,
    private feedService: FeedMicrositeService,
    private changeDetectorRef: ChangeDetectorRef,
    private currentSession: CurrentSessionService,
    private modalService: ModalShareProductService,
    private modalTicketService: ModalTicketService,
  ) {
    this.currentFilter = this.feedService.getCurrentFilter();
    this.configFiltersSubcategory = this.feedService.getConfigFiltersSubcategory();
  }

  ngOnInit() {
    this.countDown();
    let countryId;
    if (this.navigationService.getCurrentCountryId()) {
      countryId = this.navigationService.getCurrentCountryId();
    } else {
      countryId = this.currentSession.currentUser()['countryId'];
    }

    this.idCountry = countryId;
    this.loadProductsUser(countryId);
    this._subscribeCountryChanges();
  }

  ngOnDestroy(): void {
    this._subscriptionCountryChanges.unsubscribe();
    this.changeDetectorRef.markForCheck();
  }

  ngAfterViewInit() {
    this.showPagination = true;
    if (this.productsService.products.length > 0) {
      this.endForRender.notifyOnChanges();
      this.endForRender.changes.subscribe(t => {
        alert("ASD")
        this.ngForRender();
        this.changeDetectorRef.markForCheck();
      });
    }
    this.changeDetectorRef.markForCheck();
  }

  ngForRender() {
    this.productsService.products = [];
    this.productsService.getProductLocation();
    this.changeDetectorRef.markForCheck();
  }

  countDown() {
    const countDownDate = new Date('Nov 30, 2018 23:59:59').getTime();
    const that = this;
    const x = setInterval(function () {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = d * 24 + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      const hours = h > 9 ? '' + h : '0' + h;
      const minutes = m > 9 ? '' + m : '0' + m;
      const seconds = s > 9 ? '' + s : '0' + s;
      that.counter = hours + ': ' + minutes + ': ' + seconds;
      that.changeDetectorRef.markForCheck();
      if (distance < 0) {
        clearInterval(x);
      }
    }, 1000);
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
    const params = this.getParamsToProducts();
    this.loadProducts(params);
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
        products = await this.productsService.getProductsMicrosite(this.userId, params);
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
      } else {
        this.currentFilter = {
          'filter[status]': 'active',
          'filter[country]': 1,
          'filter[community]': -1,
          'page[size]': 24,
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
    this.routineUpdateProducts(
      { 'pagina': page },
      page
    );
    this.productsService.scroll = 0;
    window.scrollTo(0, 0);
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
    const routeDetailProduct = `${ROUTES.MICROSITE.LINK}/${
      ROUTES.MICROSITE.DETAIL
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
      return { 'pagina': numberPage };
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
    if (imageUrl.includes('black_friday')) {
      return true;
    }
    return false;
  }

  public openModalCupon(imageUrl, id: string) {
    if (this.isExclusiveOffer(imageUrl)) {
      const currentUser = this.currentSession.currentUser();
      if (currentUser) {
        const emailObject = {
          'convenio': 2,
          'correo': currentUser.email
        };
        this.getCoupon(emailObject, id);
      }
    }
  }

  public redirectPromo(imageUrl) {
    if (this.isExclusiveOffer(imageUrl)) {
      this.router.navigate([
        `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.PROMO}`
      ]);
    }
  }

  public getCoupon(email, id: string) {
    this.modalTicketService.getCoupon(email).subscribe((response) => {
      this.couponService = response.body.cupon;
      this.modalTicketService.open(id);
      this.changeDetectorRef.markForCheck();
    },
      (error) => { console.log(error); });
  }


}
