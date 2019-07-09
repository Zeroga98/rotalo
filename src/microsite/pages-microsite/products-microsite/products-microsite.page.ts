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
import { FormBuilder } from '@angular/forms';
import { SettingsService } from '../../../services/settings.service';
import { CAROUSEL_BANNER_TIENDA_CONFIG } from './carouselBannerTienda.config';
import { CAROUSEL_CONFIG } from './carousel.config';

@Component({
  selector: 'products--microsite',
  templateUrl: 'products-microsite.page.html',
  styleUrls: ['products-microsite.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsMicrositePage implements OnInit, OnDestroy, AfterViewInit {
  public carouselConfig: NgxCarousel;
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
  @ViewChildren('productsFinish') endForRender: QueryList<ElementRef>;
  public showPagination = false;
  public idCountry = 1;
  public counter = '';
  public filter;

  public maxPrice = null;
  public minPrice = null;
  public carObject;
  public category;
  public categoryName;
  public subcategory;
  public subcategoryName;
  public params;

  public otherFilter = {
    vehicle_airbag: false,
    vehicle_abs_brakes: false,
    vehicle_air_conditioner: false,
    vehicle_unique_owner: false
  };

  public otherFilterImmovable = {
    immovable_elevator: false,
    immovable_parking: false,
    immovable_childis_games: false,
    immovable_useful_room: false,
    immovable_pool: false,
    immovable_full_furnished: false
  };

  public bannerHomeTienda;
  public bannersCategoriaForm;
  public bannerPromocionalForm;
  public location;
  public showBannerPrincipal = true;
  public showBannersPromo = true;
  public showLogo = false;
  public srcBannerHomeTienda;

  public orderBy: string[] = [
    'Más relevante', 'Más reciente', 'Más antiguo', 'Menor precio', 'Mayor precio'
  ];

  public selected = this.orderBy[0];

  public carouselProductsConfig: NgxCarousel;
  buttonNameFilter: any;
  showFilterResponsive: boolean;

  constructor(
    private productsMicrositeService: ProductsMicrositeService,
    private router: Router,
    private utilService: UtilsService,
    private navigationService: NavigationService,
    private feedService: FeedMicrositeService,
    private changeDetectorRef: ChangeDetectorRef,
    private currentSession: CurrentSessionService,
    private modalService: ModalShareProductService,
    private modalTicketService: ModalTicketService,

    private settingsService: SettingsService,
    private formBuilder: FormBuilder
  ) {
    this.currentFilter = this.feedService.getCurrentFilter();
    this.configFiltersSubcategory = this.feedService.getConfigFiltersSubcategory();
    this.carouselConfig = CAROUSEL_CONFIG;
    this.carouselProductsConfig = CAROUSEL_BANNER_TIENDA_CONFIG;
  }

  ngOnInit() {

    //this.location = window.location.href;
    //this.getShowBanner(this.location)     

    this.loadBanners();
    this.setFormHomeShop(this.getInitialConfigHomeShop());
    this.setInitialFormPromo(this.getInitialConfigPromo());
    this.setInitialFormCategories(this.getInitialConfigCategories());

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

    this.showToFilter();
  }

  ngOnDestroy(): void {
    this._subscriptionCountryChanges.unsubscribe();
    this.changeDetectorRef.markForCheck();
  }

  ngAfterViewInit() {
    this.showPagination = true;
    if (this.productsMicrositeService.products.length > 0) {
      this.endForRender.changes.subscribe(t => {
        this.ngForRender();
        this.changeDetectorRef.markForCheck();
      });
      this.endForRender.notifyOnChanges();
    }
    this.changeDetectorRef.markForCheck();
  }

  ngForRender() {
    this.productsMicrositeService.products = [];
    this.productsMicrositeService.getProductLocation();
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
      if (this.productsMicrositeService.products.length > 0) {
        this.products = this.productsMicrositeService.products;
        this.currentPage = this.productsMicrositeService.currentPage;
        this.pageNumber = this.currentPage;
        this.changeDetectorRef.markForCheck();
      } else {
        let products;
        products = await this.productsMicrositeService.getProductsMicrosite(this.userId, params);
        this.updateProducts(products);
        this.changeDetectorRef.markForCheck();
      }
      this.totalPages = this.productsMicrositeService.getTotalProducts();
      this.filter = this.productsMicrositeService.getFiltros();
      this.otherFilter = this.productsMicrositeService.carObject.otherFilter;
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
    this.productsMicrositeService.setProductLocation(this.products, event.id, this.currentPage);
    const carObject =
    {
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    };
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
        'filter[subcategory_id]': 25,
        'filter[category]': 10
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

  showToFilter() {
    this.showFilterResponsive =
      !this.buttonNameFilter || this.buttonNameFilter === 'Aplicar';
    this.buttonNameFilter =
      !this.buttonNameFilter || this.showFilterResponsive
        ? 'Filtros'
        : 'Aplicar';
  }

  getPage(page: number) {
    this.pageNumber = page;
    this.routineUpdateProducts(
      { 'pagina': page },
      page
    );
    this.productsMicrositeService.scroll = 0;
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
    const routeDetailProduct = `${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${
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
    //if (this.isSuperUser()) {
    return { 'number': numberPage };
    //}
    //return { 'page[number]': numberPage };
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

  removeFilters() {
    this.showBannersPromo = true;
    this.minPrice = null;
    this.maxPrice = null;
    this.category = null;
    this.categoryName = null;
    this.subcategory = null;
    this.subcategoryName = null;
    this.currentFilter = {
      product_country_id: this.idCountry,
      size: 24,
      number: 1
    };
    this.otherFilter = {
      vehicle_airbag: false,
      vehicle_abs_brakes: false,
      vehicle_air_conditioner: false,
      vehicle_unique_owner: false
    };

    this.otherFilterImmovable = {
      immovable_elevator: false,
      immovable_parking: false,
      immovable_childis_games: false,
      immovable_useful_room: false,
      immovable_pool: false,
      immovable_full_furnished: false
    };
    this.routineUpdateProducts(this.feedService.getInitialFilter());
    this.scrollToTop();
  }

  public returnStringOption(option) {
    if (option) {
      option = `'${option}'`;
    }
    return option;
  }

  public scrollToTop() {
    this.productsMicrositeService.scroll = 0;
    window.scrollTo(0, 0);
  }

  /*this.router.navigate([
          `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FILTERS}`
        ], {queryParams: {product_category_id : category.id}});*/


  public filterByCategory(categoryId: String, name: String) {
    this.changeBanner(categoryId);
    this.category = categoryId;
    this.categoryName = name;
    this.showBannersPromo = false;
    this.routineUpdateProducts({ product_category_id: categoryId, number: 1 });
    this.scrollToTop();
  }

  public changeBanner(category) {
    var i;
    this.srcBannerHomeTienda = this.bannerHomeTienda.controls['urlBannerDesktop'].value;
    this.showBannersPromo = true;
    this.showBannerPrincipal = true;
    this.showLogo = false;
    this.showBannerPrincipal = true;
    for (i = 0; i < this.bannersCategoriaForm.get('bannersCategoria').controls.length; i++) {
      let cat = this.bannersCategoriaForm.get('bannersCategoria').controls[i].controls['idCategoria'].value;

      if (category == cat) {
        this.srcBannerHomeTienda = this.bannersCategoriaForm.get('bannersCategoria').controls[i].controls['urlBannerDesktop'].value;
        this.showBannersPromo = false;
        this.showBannerPrincipal = true;
        this.showLogo = false;
      }
    }
  }

  public filterBySubcategory(subcategory: string, name: string) {
    this.subcategory = subcategory;
    this.subcategoryName = name;
    this.showBannersPromo = false;
    this.routineUpdateProducts({ product_subcategory_id: subcategory, number: 1 });
    this.scrollToTop();
  }

  public filterByMinMax() {
    this.showBannersPromo = false;
    if (this.maxPrice && this.minPrice) {
      if (+this.maxPrice < +this.minPrice) {
        const auxPrice = this.maxPrice;
        this.maxPrice = this.minPrice;
        this.minPrice = auxPrice;
      }
      this.routineUpdateProducts({
        product_price: `${this.minPrice}-${this.maxPrice}`,
        number: 1
      });
      this.scrollToTop();
    } else {
      if (this.maxPrice) {
        this.routineUpdateProducts({
          product_price: `<=${this.maxPrice}`,
          number: 1
        });
        this.scrollToTop();
      } else if (this.minPrice) {
        this.routineUpdateProducts({
          product_price: `>=${this.minPrice}`,
          number: 1
        });
        this.scrollToTop();
      }
    }
  }

  public checkKilometers(operacionLogica, kilometer) {
    this.showBannersPromo = false;
    kilometer = kilometer.split('.').join('');
    if (operacionLogica != '-') {
      kilometer = operacionLogica + kilometer;
    }
    if (this.currentFilter && this.currentFilter['vehicle_mileage'] == kilometer) {
      return true;
    }
    return false;
  }

  public filterByBrand(brand: string) {
    this.showBannersPromo = false;
    this.routineUpdateProducts({ vehicle_brand_id: brand, number: 1 });
    this.scrollToTop();
  }

  public filterByModel(model: string) {
    this.showBannersPromo = false;
    this.routineUpdateProducts({ vehicle_line_id: model, number: 1 });
    this.scrollToTop();
  }

  public filterByYear(year: string) {
    this.showBannersPromo = false;
    year = this.returnStringOption(year);
    this.routineUpdateProducts({ vehicle_model: year, number: 1 });
    this.scrollToTop();
  }

  public filterByMileage(operacionLogica, mileage: string) {
    this.showBannersPromo = false;
    if (mileage) {
      mileage = mileage.split('.').join('');
      if (operacionLogica != '-') {
        mileage = operacionLogica + mileage;
      }
    }
    this.routineUpdateProducts({ vehicle_mileage: mileage, number: 1 });
    this.scrollToTop();
  }

  public filterByDisplacement(displacement: string) {
    this.showBannersPromo = false;
    displacement = this.returnStringOption(displacement);
    this.routineUpdateProducts({ vehicle_displacement: displacement, number: 1 });
    this.scrollToTop();
  }

  public filterByUseType(useType: string) {
    this.showBannersPromo = false;
    useType = this.returnStringOption(useType);
    this.routineUpdateProducts({ vehicle_use_type: useType, number: 1 });
    this.scrollToTop();
  }

  public filterByVehicleColor(color: string) {
    this.showBannersPromo = false;
    color = this.returnStringOption(color);
    this.routineUpdateProducts({ vehicle_color: color, number: 1 });
    this.scrollToTop();
  }

  public filterByTransmission(transmission: string) {
    this.showBannersPromo = false;
    transmission = this.returnStringOption(transmission);
    this.routineUpdateProducts({ vehicle_transmission: transmission, number: 1 });
    this.scrollToTop();
  }

  public filterByGas(gas: string) {
    this.showBannersPromo = false;
    gas = this.returnStringOption(gas);
    this.routineUpdateProducts({ vehicle_gas: gas, number: 1 });
    this.scrollToTop();
  }

  public filterByLicensePlate(licensePlate: string) {
    this.showBannersPromo = false;
    licensePlate = this.returnStringOption(licensePlate);
    this.routineUpdateProducts({ vehicle_license_plate: licensePlate, number: 1 });
    this.scrollToTop();
  }

  public filterByTypeSeat(typeSeat: string) {
    this.showBannersPromo = false;
    typeSeat = this.returnStringOption(typeSeat);
    this.routineUpdateProducts({ vehicle_type_of_seat: typeSeat, number: 1 });
    this.scrollToTop();
  }

  public filterByOthersVehicle(other) {
    this.showBannersPromo = false;
    other = Object.assign(other, { number: 1 });
    this.routineUpdateProducts(other);
  }

  public filterByAntiquity(antiquity: string) {
    this.showBannersPromo = false;
    antiquity = this.returnStringOption(antiquity);
    this.routineUpdateProducts({ immovable_antiquity: antiquity, number: 1 });
    this.scrollToTop();
  }

  public filterByImmovable(immovable: string) {
    this.showBannersPromo = false;
    this.routineUpdateProducts({ immovable_floor: immovable, number: 1 });
    this.scrollToTop();
  }

  public filterBySellerType(sellerType: string) {
    this.showBannersPromo = false;
    sellerType = this.returnStringOption(sellerType);
    this.routineUpdateProducts({ immovable_seller_type: sellerType, number: 1 });
    this.scrollToTop();
  }

  public filterByRoom(room: string) {
    this.showBannersPromo = false;
    room = this.returnStringOption(room);
    this.routineUpdateProducts({ immovable_rooms: room, number: 1 });
    this.scrollToTop();
  }

  public filterByBathRoom(bathroom: string) {
    this.showBannersPromo = false;
    this.routineUpdateProducts({ immovable_bathrooms: bathroom, number: 1 });
    this.scrollToTop();
  }

  public filterBySocialClass(socialclass: string) {
    this.showBannersPromo = false;
    this.routineUpdateProducts({ immovable_social_class: socialclass, number: 1 });
    this.scrollToTop();
  }

  public filterBySquaremeters(squaremeter: string) {
    this.showBannersPromo = false;
    this.routineUpdateProducts({ immovable_square_meters: squaremeter, number: 1 });
    this.scrollToTop();
  }

  public filterByQuotaAdmin(quota: string) {
    this.showBannersPromo = false;
    this.routineUpdateProducts({ immovable_canon_quota: quota, number: 1 });
    this.scrollToTop();
  }

  public filterByGuardHouse(guard: string) {
    this.showBannersPromo = false;
    guard = this.returnStringOption(guard);
    this.routineUpdateProducts({ immovable_guard_house: guard, number: 1 });
    this.scrollToTop();
  }

  public filterByOthersImmovable(other) {
    this.showBannersPromo = false;
    other = Object.assign(other, { number: 1 });
    this.routineUpdateProducts(other);
  }






  public filterByGender(genderId) {
    this.routineUpdateProducts({ fashion_gender_id: genderId, number: 1 });
    this.scrollToTop();
  }

  public filterBySizeClothes(sizeId) {
    this.routineUpdateProducts({ fashion_size_id: sizeId, number: 1 });
    this.scrollToTop();
  }

  public filterByColorClothes(color: string) {
    color = this.returnStringOption(color);
    this.routineUpdateProducts({ fashion_color: color, number: 1 });
    this.scrollToTop();
  }


  /*************** BANNER LA TIENDA *********************/
  /*getShowBanner(string: String){
    if(string.indexOf('home')>=0){
      this.showBannersPromo = true;
    }
  }*/

  loadBanners() {
    this.settingsService.getBannersShop(1).subscribe(response => {
      if (response.body) {
        if (response.body.bannerHomeTienda) { this.setFormHomeShop(response.body.bannerHomeTienda); }
        if (response.body.bannerPromocional && response.body.bannerPromocional.length > 0) { this.setInitialFormPromo(response.body); }
        if (response.body.bannersCategoria && response.body.bannersCategoria.length > 0) { this.setInitialFormCategories(response.body); }
      }

      this.srcBannerHomeTienda = this.bannerHomeTienda.controls['urlBannerDesktop'].value;
    });
  }

  private getInitialConfigHomeShop() {
    const config = {
      'idLogo': '',
      'urlLogo': '',
      'idBannerDesktop': '',
      'urlBannerDesktop': '',
      'idBannerMobile': '',
      'urlBannerMobile': ''
    };
    return config;
  }

  private getInitialConfigPromo() {
    const bannerPromocional = {
      bannerPromocional: [
        {
          'idBannerPromocional': '',
          'idBannerDesktop': '',
          'urlBannerDesktop': '',
          'idBannerMobile': '',
          'urlBannerMobile': '',
          'idCategoria': '',
          'link': ''
        }
      ]
    };
    return bannerPromocional;
  }

  private getInitialConfigCategories() {
    const bannersCategoria = {
      bannersCategoria: [
        {
          'idBannerCategoria': '',
          'idBannerDesktop': '',
          'urlBannerDesktop': '',
          'idBannerMobile': '',
          'urlBannerMobile': '',
          'idCategoria': ''
        }
      ]
    };
    return bannersCategoria;
  }

  private setFormHomeShop(config) {
    this.bannerHomeTienda = this.formBuilder.group({
      'idLogo': [config.idLogo],
      'urlLogo': [config.urlLogo],
      'idBannerDesktop': [config.idBannerDesktop],
      'urlBannerDesktop': [config.urlBannerDesktop],
      'idBannerMobile': [config.idBannerMobile],
      'urlBannerMobile': [config.urlBannerMobile]
    });
  }

  private setInitialFormPromo(config) {
    this.bannerPromocionalForm = this.formBuilder.group({
      bannerPromocional: this.formBuilder.array(
        this.createItemShop(config.bannerPromocional)
      )
    });
  }

  private setInitialFormCategories(config) {
    this.bannersCategoriaForm = this.formBuilder.group({
      bannersCategoria: this.formBuilder.array(
        this.createItem(config.bannersCategoria)
      )
    });
  }

  private createItemShop(bannersForm) {
    const bannerPromocional = bannersForm.map(banner => {
      return this.formBuilder.group({
        idBannerPromocional: banner.idBannerPromocional,
        idBannerDesktop: banner.idBannerDesktop,
        urlBannerDesktop: banner.urlBannerDesktop,
        idBannerMobile: banner.idBannerMobile,
        urlBannerMobile: banner.urlBannerMobile,
        idCategoria: banner.idCategoria,
        link: banner.link
      });
    });
    return bannerPromocional;
  }

  private createItem(bannersForm) {
    const bannersCategoria = bannersForm.map(banner => {
      return this.formBuilder.group({
        idBannerCategoria: banner.idBannerCategoria,
        idBannerDesktop: banner.idBannerDesktop,
        urlBannerDesktop: banner.urlBannerDesktop,
        idBannerMobile: banner.idBannerMobile,
        urlBannerMobile: banner.urlBannerMobile,
        idCategoria: banner.idCategoria
      });
    });
    return bannersCategoria;
  }

  goHomeStore() {
    const routeHome = `${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}`;
    var categoria = document.createElement("a");
    categoria.href = routeHome;
    categoria.click();
  }

  redirectLink(url) {
    var categoria = document.createElement("a");
    categoria.target = "_blank";
    categoria.href = url;
    categoria.click();
  }

  redirectCategory(categoria: String) {
    this.filterByCategory(categoria, '');
  }

  public filterOrder(filtro) {
    let order;
    if (filtro === 'Relevancia') {
      order = "product_store_index-asc";
      this.routineUpdateProducts({ sort: order, number: 1 });
      this.scrollToTop();
    }
    if (filtro === 'Más reciente') {
      order = "product_published_at-desc";
      this.routineUpdateProducts({ sort: order, number: 1 });
      this.scrollToTop();
    }
    if (filtro === 'Más antiguo') {
      order = "product_published_at-asc";
      this.routineUpdateProducts({ sort: order, number: 1 });
      this.scrollToTop();
    }
    if (filtro === 'Menor precio') {
      order = "product_price-asc";
      this.routineUpdateProducts({ sort: order, number: 1 });
      this.scrollToTop();
    }
    if (filtro === 'Mayor precio') {
      order = "product_price-desc";
      this.routineUpdateProducts({ sort: order, number: 1 });
      this.scrollToTop();
    }
  }

}
