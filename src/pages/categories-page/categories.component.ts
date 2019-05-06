import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ROUTES } from '../../router/routes';
import { UserService } from '../../services/user.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  public userEdit;
  public userName;
  public message = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.MESSAGES}`;
  public sold = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SOLD}`;
  public selling = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SELLING}`;
  public edit = `/${ROUTES.PROFILE}/${ROUTES.EDITPROFILE}`;
  public security = `/${ROUTES.PROFILE}/${ROUTES.PROFILEPASS}`;
  public hobbies = `/${ROUTES.PROFILE}/${ROUTES.HOBBIES}`;
  public notificationsSettings = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.NOTIFICATIONSSETTINGS}`;

  public featuredProduct = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.FEATUREDPRODUCT}`;
  public adminRegister  = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.ADMINREGISTER}`;
  public adminOrders = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.ADMINORDERS}`;
  public campaign = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.CAMPAIGN}`;
  public banners = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.BANNER}`;

  public profileShow = `/${ROUTES.PROFILE}/${ROUTES.SHOW}`;

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
    this.loginService.logout();
  }

}
