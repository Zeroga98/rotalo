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
import {Observable} from 'rxjs';
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
  public totalCart = 0;
  public suggestList;

  results: any[] = [];
  queryField: FormControl = new FormControl();

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    const currentPage = this.router.url;
    if (this.screenWidth <= 700) {
      this.rotaloCenter = `/${ROUTES.ROTALOCENTER}`;
      this.rotaloProfile = `/${ROUTES.PROFILE}`;
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
    private navigationTopService:NavigationTopService,
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
      'rutaRenoEscondido':  this.router.url
    };

    if (this.router.url == `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`) {
      this.showOptions = true;
    } else {
      this.showOptions = false;
    }
    this.isBancolombiaShopValidation();
    this.messagesService.setUnreadNotificationParam(path);

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        path = {
          'rutaRenoEscondido':  this.router.url
        };
        if (this.router.url == '/products/home') {
          this.showOptions = true;
        } else {
          this.showOptions = false;
        }
        this.isBancolombiaShopValidation();
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

  }

  isBancolombiaShopValidation() {
    if (this.router.url.includes(`${ROUTES.MICROSITE.LINK}`)) {
      this.isBancolombiaShop = true;
      this.getTotalProductsCart();
    } else {
      this.isBancolombiaShop = false;
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
      } else  {
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
    const urlMicrosite  = `/${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.FEED}`;
    if (this.router.url.includes(urlMicrositeProduct) && urlMicrosite != this.router.url) {
      this.router.navigate([urlMicrosite]);
    } else {
      `/${url}` === this.router.url ? location.reload() : this.router.navigate([url]);
    }
  }

  get messageAvailable(): boolean {
    return this.messagesUnRead > 0;
  }

  get hobbyNotification(): boolean {
    return this.notificationHobby;
  }

  private  setListenerMessagesUnread(userId) {
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
    // this.categorySelected.emit(category);
    this.navigationTopService.changeCategory(category);
  }

  selectedSubCategory(subCategory: SubcategoryInterface) {

    this._closeMenu();
   // this.subCategorySelected.emit(subCategory);
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
      if(response.body) {
        this.suggestList =  response.body.sugerencias;
        this.changeDetector.markForCheck();
      }
    });
  }

  onSubmitSearch() {
    this.changeTags();
  }

  changeTags() {
    if(this.queryField.value) {
      this.autoCompleteOptions = this.navigationTopService.addOptions(this.queryField.value);
      this.gapush(
        'send',
        'event',
        'Home',
        'ClickBusqueda',
        this.queryField.value
      );
      this.router.navigate([
        `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FILTERS}`
      ], {queryParams: {product_name : this.queryField.value}});
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
    } else  {
      this.router.navigate([
        `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.MOBILENOTIFICATIONS}`
      ]);
    }
  }

  loadNotifications() {
    this.navigationTopService.loadNotifications(true);
  }


  goToCategory(suggestion) {
    console.log(suggestion);
    if(suggestion) {
      if (suggestion.type == 'category') {
        this.router.navigate([
          `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FILTERS}`
        ], {queryParams: {product_category_id : suggestion.idSuggestion}});
      } else  {
        this.router.navigate([
          `${suggestion}`
        ], {queryParams: {product_subcategory_id: suggestion.idSuggestion}});
      }
    }
  }


}
