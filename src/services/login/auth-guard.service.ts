import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/interfaces';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { ROUTES } from '../../router/routes';
import { ProductsService } from '../products.service';


@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private loginService: LoginService,
    private router: Router, private productsService: ProductsService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkLoggedIn();
  }

  checkLoggedIn(): boolean {
    if (this.loginService.isLoggedIn()) {
      return true;
    }
    const urlCurrent = window.location.href;
    if (urlCurrent.includes(`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}`)) {
      this.productsService.setUrlDetailProduct(urlCurrent);
    }
    this.router.navigate([`/${ROUTES.LOGIN}`]);
    return false;
  }
}
