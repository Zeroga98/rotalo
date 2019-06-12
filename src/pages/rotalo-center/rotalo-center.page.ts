import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTES } from '../../router/routes';
import { ResumeRotaloCenterService } from '../../services/resume-rotalo-center.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { HostListener } from '@angular/core';
import { NavigationService } from '../products/navigation.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'rotalo-center',
  templateUrl: './rotalo-center.page.html',
  styleUrls: ['./rotalo-center.page.scss']
})

export class RotaloCenterPage implements OnInit  {
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

  public screenHeight;
  public screenWidth;
  public showMenu: boolean = true;
  public messagesUnRead: number = 0;
  public currentUser;

  public options = [false, false, false, false];

  readonly defaultImage: string = '../assets/img/user_sin_foto.svg';
  public userInfo;
  public userName: String;
  public photoUrl: String;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    const currentPage = this.router.url;
    this.validateMobileMenu();
  }


  constructor(public router: Router,
    private navigationService: NavigationService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private currentSessionSevice: CurrentSessionService
    ) {
    this.onResize();
    this.getUserInfo();
    this.router.events.subscribe((val) => {
      this.validateMobileMenu();
    });

    this.userService.changePhoto.subscribe(response => {
      const photo = {
        id: response.photoId || response.id,
        url: response.urlPhoto || response.url
      };
      this.userInfo.photo = photo;
      if (response  && response.urlPhoto) {
        this.photoUrl = this.userInfo.photo.url;
      }
    });
  }

  validateMobileMenu() {
    const currentPage = this.router.url;
    if (this.screenWidth <= 700) {
      if (currentPage === `/${ROUTES.ROTALOCENTER}`) {
        this.showMenu = true;
      } else {
        this.showMenu = false;
      }
    } else {
      this.showMenu = true;
    }
  }

  ngOnInit() {
    this.getInfoUser();
  }

  get messageAvailable(): boolean {
    this.messagesUnRead = this.navigationService.getMessagesUnRead();
    return this.messagesUnRead > 0;
  }

  get getMessagesUnRead(){
    this.messagesUnRead = this.navigationService.getMessagesUnRead();
    return this.messagesUnRead;
  }

  get isHideBackArrow() {
    return (
      this.router.url === `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
    );
  }

  isSuperUser() {
    if (this.currentSessionSevice.currentUser()['rol'] && this.currentSessionSevice.currentUser()['rol'] === 'superuser') {
      return true;
    }
    return false;
  }

  async getInfoUser() {
    const user = await this.userService.getInfoUser();
    this.currentUser = user;
  }

  async getUserInfo() {
    try {
      this.userInfo = await this.userService.getInfoUser();

      this.setUserinfo();
    } catch (error) {
      console.error(error);
    }
  }

  setUserinfo() {
    this.userName =   this.userInfo.name;
    if (this.userInfo.photo && this.userInfo.photo.url) {
      this.photoUrl = this.userInfo.photo.url;
    }
  }

  updateSrc(evt) {
    evt.currentTarget.src = this.defaultImage;
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

}
