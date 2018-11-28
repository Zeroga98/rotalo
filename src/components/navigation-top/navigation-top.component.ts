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
  public showAnimation = false;
  public promoCode = '';
  public communities;
  @Output() selectedCommunity: EventEmitter<any> = new EventEmitter();
  @Output() tagsChanged: EventEmitter<Array<string>> = new EventEmitter();
  @Output() categorySelected: EventEmitter<CategoryInterface> = new EventEmitter();
  @Output() subCategorySelected: EventEmitter<SubcategoryInterface> = new EventEmitter();
  @ViewChild('closeMenu', { read: ElementRef }) closeMenu: ElementRef;
  @ViewChild('closeMenuLabel', { read: ElementRef }) closeMenuLabel: ElementRef;
  @ViewChild('categoriesMenu', { read: ElementRef }) categoriesMenu: ElementRef;
  @ViewChild('autoCompleteBox', { read: ElementRef }) autoCompleteBox: ElementRef;

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
  ) {
    this.onResize();
  }

  ngOnInit() {
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
    this.messagesService.setUnreadNotificationParam(path);
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        path = {
          'rutaRenoEscondido':  this.router.url
        };
        this.messagesService.setUnreadNotificationParam(path);
      }
    });
    if (!this.userService.getCommunitiesCurrent()) {
      this.getCommunities();
    } else {
      this.communities = this.userService.getCommunitiesCurrent();
    }
  }

  async getCommunities() {
    try {
      const communities = await this.userService.getCommunities();
      this.communities = communities.communities;
      this.userService.setCommunities(this.communities);
    } catch (error) {
      console.error(error);
    }
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
    `/${url}` === this.router.url
      ? location.reload()
      : this.router.navigate([url]);
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
          this.showAnimation = state.body.informacionReno.dibujarRenoRuta;
          this.promoCode = state.body.informacionReno.codigoReno;
          this.messagesUnRead = state.body.cantidadNotificaciones;
          this.notificationHobby = state.body.notificacionActIntereses;
          this.navigationService.setNotificationHobbies(this.notificationHobby);
          this.navigationService.setMessagesUnRead(this.messagesUnRead);
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

  get isColombiaCountry() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('co')) {
      return true;
    }
    return false;
  }


  selectedCategory(category: CategoryInterface) {
    this._closeMenu();
    this.categorySelected.emit(category);
  }

  selectedSubCategory(subCategory: SubcategoryInterface) {
    this._closeMenu();
    this.subCategorySelected.emit(subCategory);
  }

  openCategories(evt) {
    this.categoriesMenu.nativeElement.classList.toggle('opened');
   // this.closeMenu.nativeElement.classList.toggle('icon-menu');
    this.closeMenu.nativeElement.classList.toggle('gtmCategorias');
    this.closeMenuLabel.nativeElement.classList.toggle('gtmCategorias');
  }

  private _closeMenu() {
    this.categoriesMenu.nativeElement.classList.remove('opened');
    this.closeMenu.nativeElement.classList.add('icon-menu');
  }

}
