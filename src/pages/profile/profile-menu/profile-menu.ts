import { Component, OnInit, HostListener } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { UserService } from '../../../services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CountryInterface } from '../../../components/select-country/country.interface';
import { CurrentSessionService } from '../../../services/current-session.service';
import { ROUTES } from '../../../router/routes';
import { Router } from '@angular/router';
import { NavigationService } from '../../products/navigation.service';

@Component({
  selector: 'show-page',
  templateUrl: 'profile-menu.html',
  styleUrls: ['profile-menu.scss']
})
export class ProfileMenu implements OnInit {
  public edit = `/${ROUTES.PROFILE}/${ROUTES.EDITPROFILE}`;
  public security = `/${ROUTES.PROFILE}/${ROUTES.PROFILEPASS}`;
  public hobbies = `/${ROUTES.PROFILE}/${ROUTES.HOBBIES}`;
  readonly defaultImage: string = '../assets/img/user_sin_foto.svg';
  userInfo: any;
  photoUrl: String;
  photoProfile: any;
  userName: String;
  defaultCountry: CountryInterface;
  public screenHeight;
  public screenWidth;
  public showMenu: boolean = true;
  public notificationHobby = false;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.validateMobileMenu();
  }

  constructor(private sanitizer: DomSanitizer, private loginService: LoginService, private userService: UserService,
    private currentSession: CurrentSessionService, public router: Router, private navigationService: NavigationService) {
    this.defaultCountry = { id: this.currentSession.currentUser()['countryId'] };
   }

  ngOnInit() {
    this.getUserInfo();
    this.onResize();
    this.router.events.subscribe((val) => {
      this.validateMobileMenu();
    });
  }

  validateMobileMenu() {
    const currentPage = this.router.url;
    if (this.screenWidth <= 700) {
      if (currentPage === `/${ROUTES.PROFILE}`) {
        this.showMenu = true;
      }else {
        this.showMenu = false;
      }
    }else{
      this.showMenu = true;
    }
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
      //this.photoProfile = this.sanitizer.bypassSecurityTrustStyle('url(' + this.photoUrl + ')');
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

  updateSrc(evt) {
    evt.currentTarget.src = this.defaultImage;
  }

  get notificationHobbies(): boolean {
    this.notificationHobby = this.navigationService.getNotificationHobbies();
    return this.notificationHobby;
  }

}
