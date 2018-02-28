import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login.service';
import { ROUTES } from '../../router/routes';

@Injectable()
export class LoggedGuardService implements CanActivate {

constructor(private loginService: LoginService,
  private router: Router  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkLoggedIn();
  }

  checkLoggedIn(): boolean {
    if ( this.loginService.isLoggedIn()) {
      this.router.navigate([`${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`]);
      return false;
    }
    return true;
  }
}
