import { CountryInterface } from './../select-country/country.interface';
import { ChangeDetectorRef, HostListener, ElementRef, ViewChild } from '@angular/core';
import { NotificationsService } from './../../services/notifications.service';
import { Router, NavigationEnd } from '@angular/router';
import { ROUTES } from './../../router/routes';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { NavigationService } from '../../pages/products/navigation.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { UserService } from '../../services/user.service';
import { CollectionSelectService } from '../../services/collection-select.service';
import { LoginService } from '../../services/login/login.service';
import { ProductsService } from '../../services/products.service';
import { SubcategoryInterface } from '../../commons/interfaces/subcategory.interface';
import { CategoryInterface } from '../../commons/interfaces/category.interface';
import { NavigationTopService } from './navigation-top.service';
import { ShoppingCarService } from '../../microsite/services-microsite/front/shopping-car.service';
import { UserInterface } from '../../commons/interfaces/user.interface';
import { Observable } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'navigation-top',
  templateUrl: './navigation-top.component.html',
  styleUrls: ['./navigation-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationTopComponent implements OnInit, OnDestroy {
  @Output() countryChanged: EventEmitter<any> = new EventEmitter();
  @Input() hideBackArrow: boolean = false;
  @Input() defaultCountryValue: CountryInterface;
  readonly defaultImage: string = '../assets/img/user_sin_foto.svg';
  rotaloCenter: string = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.INFOROTALOCENTER}`;
  rotaloProfile: string = `/${ROUTES.PROFILE}/${ROUTES.SHOW}`;
  rotaloCart: string = `${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.CAR}`;

  uploadProductPage = ROUTES.PRODUCTS.UPLOAD;
  isModalMessageShowed: boolean = false;
  listenerNotifications: any;
  listenerMessages: any;
  messagesUnRead: number = 0;
  notificationHobby = false;
  notificationsUnread: number = 0;
  userId;
  public screenHeight;
  public screenWidth;
  private readonly timeToCheckNotification: number = 5000;
  showDropdownMenu = false;
  public communities;
  @Output() selectedCommunity: EventEmitter<any> = new EventEmitter();
  @Output() tagsChanged: EventEmitter<Array<string>> = new EventEmitter();
  @Output() categorySelected: EventEmitter<CategoryInterface> = new EventEmitter();
  @Output() subCategorySelected: EventEmitter<SubcategoryInterface> = new EventEmitter();
  @ViewChild('closeMenu', { read: ElementRef }) closeMenu: ElementRef;
  @ViewChild('closeMenuLabel', { read: ElementRef }) closeMenuLabel: ElementRef;
  @ViewChild('categoriesMenu', { read: ElementRef }) categoriesMenu: ElementRef;
  @ViewChild('autoCompleteBox', { read: ElementRef }) autoCompleteBox: ElementRef;
  public autoCompleteOptions: Array<string> = [];
  public tags: Array<string> = [];
  public showOptions;
  public isBancolombiaShop;
  public isAtUploadOffer;
  public totalCart = 0;
  public userEdit;
  public userName;

  public notificationsSettings = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.NOTIFICATIONSSETTINGS}`;
  public adminOrders = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.ADMINORDERS}`;
  public adminRegister  = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.ADMINREGISTER}`;
  public featuredProduct = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.FEATUREDPRODUCT}`;
  public selling = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SELLING}`;
  public sold = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SOLD}`;
  public messages = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.MESSAGES}`;
  public infoRotalo = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.INFOROTALOCENTER}`;
  public campaign = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.CAMPAIGN}`;
  public banners = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.BANNER}`;
  public users = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.ADMINUSERS}`;
  public productShop = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.PRODUCTSSHOP}`;

  public edit = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.EDITPROFILE}`;
  public security = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.PROFILEPASS}`;
  public hobbies = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.HOBBIES}`;
  public profileShow = `/${ROUTES.ROTALOCENTER}/${ROUTES.SHOW}`;

  public uploadProducts = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.UPLOADPRODUCTS}`;
  public bannersShop = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SHOPBANNERS}`;
  public suggestList;
  results: any[] = [];
  queryField: FormControl = new FormControl();
  public showSearchMobile = false;
  public menu  = `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.MOBILEMENU}`;
  public options = [false, false, false, false];

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    const currentPage = this.router.url;
    if (this.screenWidth <= 700) {
      this.rotaloCenter = `/${ROUTES.ROTALOCENTER}`;
      this.rotaloProfile = `/${ROUTES.ROTALOCENTER}`;
    }
  }

  constructor(
    private router: Router,
    private messagesService: MessagesService,
    private changeDetector: ChangeDetectorRef,
    private navigationService: NavigationService,
    private notificationsService: NotificationsService,
    private currentSessionService: CurrentSessionService,
    private userService: UserService,
    private collectionService: CollectionSelectService,
    private loginService: LoginService,
    private productsService: ProductsService,
    private navigationTopService: NavigationTopService,
    private shoppingCarService: ShoppingCarService,

  ) {
    this.onResize();
  }

  ngOnInit() {

    this.queryField.valueChanges.pipe(debounceTime(200))
      .subscribe(result => {
        this.search(result);
      }
      );

    this.getCountries();
    this.defaultCountryValue = {
      id: this.navigationService.getCurrentCountryId()
    };
    this.userId = this.currentSessionService.getIdUser();
    this.setListenerMessagesUnread(this.userId);
    if (this.navigationService.getMessagesUnRead()) {
      this.messagesUnRead = this.navigationService.getMessagesUnRead();
    }

    if (this.navigationService.getNotificationHobbies()) {
      this.notificationHobby = this.navigationService.getNotificationHobbies();
    }

    let path = {
      'rutaRenoEscondido': this.router.url
    };

    if (this.router.url == `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`) {
      this.showOptions = true;
    } else {
      this.showOptions = false;
    }
    this.isBancolombiaShopValidation();
    this.isAtUploadOfferValidation();
    this.messagesService.setUnreadNotificationParam(path);

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        path = {
          'rutaRenoEscondido': this.router.url
        };
        if (this.router.url == '/products/home') {
          this.showOptions = true;
        } else {
          this.showOptions = false;
        }
        this.isBancolombiaShopValidation();
        this.isAtUploadOfferValidation();
        this.messagesService.setUnreadNotificationParam(path);
      }
    });

    if (!this.userService.getCommunitiesCurrent()) {
      this.getCommunities();
    } else {
      this.communities = this.userService.getCommunitiesCurrent();
    }
    this.autoCompleteOptions = this.navigationTopService.getAutoCompleteOptions();
    this.cartNumberSubscription();
    this.getInfoUser();

  }

  async getInfoUser() {
    this.userEdit = await this.userService.getInfoUser();
    if (this.userEdit.name) {
      const name = this.userEdit.name.split(' ');
      this.userName = name[0];
      this.changeDetector.markForCheck();
    }
  }

  isBancolombiaShopValidation() {
    if (this.router.url.includes(`${ROUTES.MICROSITE.LINK}`)) {
      this.isBancolombiaShop = true;
      this.getTotalProductsCart();
    } else {
      this.isBancolombiaShop = false;
    }
  }

  isAtUploadOfferValidation() {
    if (this.router.url.includes(`${ROUTES.PRODUCTS.UPLOAD}`)) {
      this.isAtUploadOffer = true;
      this.getTotalProductsCart();
    } else {
      this.isAtUploadOffer = false;
    }
  }

  async getCommunities() {
    try {
      const communities = await this.userService.getCommunities();
      this.communities = communities.body.comunidades;
      this.userService.setCommunities(this.communities);
    } catch (error) {
      console.error(error);
    }
  }

  async getTotalProductsCart() {
    try {
      if (!this.shoppingCarService.getTotalCartProducts()) {
        const quantityCart = await this.shoppingCarService.getCartInfo();
        this.totalCart = quantityCart;
      } else {
        this.totalCart = this.shoppingCarService.getTotalCartProducts();
      }
      this.changeDetector.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  get cartAvailable(): boolean {
    return this.totalCart > 0;
  }

  async getCountries() {
    try {
      await this.collectionService.isReady();
      this.changeDetector.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.listenerNotifications);
  }

  changeSelectorCounrty(evt) {
    this.countryChanged.emit(evt);
    this.navigationService.setCurrentCountryId(evt.id);
    this.goToFeed(evt.id);
  }

  onActivateMenu() {
    this.showDropdownMenu = !this.showDropdownMenu;
  }

  goToHome() {
    const url = `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`;
    const urlMicrositeProduct = `${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}`;
    const urlMicrosite = `/${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.FEED}`;
    if (this.router.url.includes(urlMicrositeProduct) && urlMicrosite != this.router.url) {
      this.router.navigate([urlMicrosite]);
    } else {
      `/${url}` === this.router.url ? location.reload() : this.router.navigate([url]);
    }
    this.queryField.reset();
  }

  get messageAvailable(): boolean {
    return this.messagesUnRead > 0;
  }

  get hobbyNotification(): boolean {
    return this.notificationHobby;
  }

  private setListenerMessagesUnread(userId) {
    this.messagesService.getMessagesUnred(userId).subscribe(
      state => {
        if (state && state.body) {
          this.messagesUnRead = state.body.cantidadMensajes;
          this.notificationsUnread = state.body.cantidadNotificaciones;
          this.notificationHobby = state.body.notificacionActIntereses;
          this.navigationService.setNotificationHobbies(this.notificationHobby);
          this.navigationService.setMessagesUnRead(this.messagesUnRead);
        }
        if (state.status == 9999) {
          this.loginService.logout();
        }
        this.changeDetector.markForCheck();
      },
      error => {
        if (error.error.error == 401) {
          this.loginService.logout();
        }
      }
    );
  }

  private goToFeed(id: number) {
    const currentUrl = window.location.pathname;
    const feedUrl = `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`;
    if (currentUrl !== feedUrl) {
      this.router.navigate([`${feedUrl}`]);
    }
  }

  onLogout() {
    const result = confirm('¿Seguro quieres cerrar tu sesión en Rótalo?');
    if (!result) {
      const currentUrl = window.location.pathname;
      this.router.navigate([`${currentUrl}`]);
      return;
    }
    this.loginService.logout();
  }

  initScrollProduct() {
    this.productsService.scroll = undefined;
  }

  goToUploadProduct() {
    if (!this.isBancolombiaShop) {
      this.router.navigate([`${ROUTES.PRODUCTS.LINK}/${
        ROUTES.PRODUCTS.UPLOAD}`]);
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
    }
  }

  get isColombiaCountry() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('co')) {
      return true;
    }
    return false;
  }


  selectedCategory(category: CategoryInterface) {
    this._closeMenu();
    this.navigationTopService.changeCategory(category);
  }

  selectedSubCategory(subCategory: SubcategoryInterface) {

    this._closeMenu();
    this.navigationTopService.changeSubCategory(subCategory);
  }

  openCategories(evt) {
    this.categoriesMenu.nativeElement.classList.toggle('opened');
    document.getElementById('back-categories').classList.toggle('opened');
  }

  changeSelectComunidad(evt) {
    let name;
    if (evt.target.selectedOptions) {
      name = evt.target.selectedOptions[0].text;
    } else {
      name = evt.target.options[evt.target.selectedIndex].text;
    }
    const id = evt.target.value;
    this.navigationTopService.changeCommunity({ name, id });
    this.changeDetector.markForCheck();
  }

  search(event) {
    this.navigationTopService.getAutoComplete(event).subscribe((response) => {
      if (response.body) {
        this.suggestList = response.body.sugerencias;
        this.changeDetector.markForCheck();
      }
    });
  }

  onSubmitSearch() {
    this.changeTags();
  }

  changeTags() {
    if (this.queryField.value) {
      this.autoCompleteOptions = this.navigationTopService.addOptions(this.queryField.value);
      this.gapush(
        'send',
        'event',
        'Home',
        'ClickBusqueda',
        this.queryField.value
      );
      this.showSearchMobile = false;
      this.router.navigate([
        `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FILTERS}`
      ], { queryParams: { product_name: this.queryField.value } });
    }
  }

  public _closeMenu() {
    this.categoriesMenu.nativeElement.classList.remove('opened');
    document.getElementById('back-categories').classList.remove('opened');
  }

  goToShoppingCar() {
    if (this.isBancolombiaShop) {
      this.router.navigate([this.rotaloCart]);
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

  cartNumberSubscription() {
    this.shoppingCarService.currentEventCart.subscribe(event => {
      if (event) {
        this.totalCart = event;
        this.changeDetector.markForCheck();
      }
    });
  }

  isActive(tab): boolean {
    if (this.router.url.includes(tab)) {
      return true;
    }
    return false;
  }

  goToNotifications() {
    if (this.isActive('mobile_notification')) {
      window.history.back();
    } else {
      this.router.navigate([
        `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.MOBILENOTIFICATIONS}`
      ]);
    }
  }

  goToMenu() {
    this.router.navigate([
      `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.MOBILEMENU}`
    ]);
  }

  loadNotifications() {
    this.navigationTopService.loadNotifications(true);
  }

  goToCategory(suggestion) {
    if (suggestion) {
      if (suggestion.type == 'category') {
        this.router.navigate([
          `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FILTERS}`
        ], { queryParams: { product_category_id: suggestion.idSuggestion } });
        this.changeDetector.markForCheck();
      } else {
        this.router.navigate([
          `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FILTERS}`
        ], { queryParams: { product_subcategory_id: suggestion.idSuggestion } });
        this.changeDetector.markForCheck();
      }
    }
  }

  isSuperUser() {
    if (
      this.currentSessionService.currentUser() &&
      this.currentSessionService.currentUser()['rol'] &&
      this.currentSessionService.currentUser()['rol'] === 'superuser'
    ) {
      return true;
    }
    return false;
  }

  openSearch() {
    this.showSearchMobile = !this.showSearchMobile;
  }

  hideMenuIcon() {
    if (this.router.url == '/products/mobile_menu') {
      return true;
    }
    return false;
  }

  goBack(): void {
    window.history.back();
  }

  validateIfIsActive(option) {
    if (option.classList.contains('active')) {
      return true;
    }
    return false;
  }

  closeOptions(option) {
    for (let i = 0; i < this.options.length; i++) {
      if (option != i) {
        this.options[i] = false;
      }
    }
  }

  closeAllOptions() {
    for (let i = 0; i < this.options.length; i++) {
      this.options[i] = false;
    }
  }

  selectOption(option, indexOption) {
    if (option.classList.contains('open') && option.classList.contains('active')) {
      this.options[indexOption] = false;
      option.classList.remove('open');
    } else  {
      this.options[indexOption] = !this.options[indexOption];
    }
  }

}
