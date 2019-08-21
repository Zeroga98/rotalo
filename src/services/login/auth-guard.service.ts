import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/interfaces';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { ROUTES } from '../../router/routes';
import { ProductsService } from '../products.service';
import { ProductsMicrositeService } from '../../microsite/services-microsite/back/products-microsite.service';


@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private loginService: LoginService,
    private router: Router, private productsService: ProductsService,
    private productsMicrositeService: ProductsMicrositeService
    ) {
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
    } else if (urlCurrent.includes(`/${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.FEED}`)) {
      this.productsMicrositeService.setUrlShop(urlCurrent);
    }
    this.router.navigate([`/${ROUTES.LOGIN}`]);
    return false;
  }
}
