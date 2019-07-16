import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ROUTES } from '../../router/routes';
import { UserService } from '../../services/user.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styleUrls: ['./menu-mobile.component.scss']
})
export class MenuMobileComponent implements OnInit {
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
  public categories = `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.CATEGORIES}`;
  public uploadProducts = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.UPLOADPRODUCTS}`;
  public options = [false, false, false, false];
  readonly defaultImage: string = '../assets/img/user_sin_foto.svg';
  constructor(private userService: UserService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private loginService: LoginService,
    private currentSessionService: CurrentSessionService,
    ) { }

  ngOnInit() {
    this.getInfoUser();
  }

  async getInfoUser() {
    this.userEdit = await this.userService.getInfoUser();
    if (this.userEdit.name) {
      const name = this.userEdit.name.split(' ');
      this.userName = name[0];
    }
    this.changeDetector.markForCheck();
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

  onLogout() {
    const result = confirm('¿Seguro quieres cerrar tu sesión en Rótalo?');
    if (!result) {
      const currentUrl = window.location.pathname;
      this.router.navigate([`${currentUrl}`]);
      return;
    }
    this.gapush('send', 'event', 'Home', 'ClicPerfil', 'ConfiguracionCerrarSesion');
    this.loginService.logout();
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
