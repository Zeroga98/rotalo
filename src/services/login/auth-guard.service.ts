import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/interfaces';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { ROUTES } from '../../router/routes';


@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private loginService: LoginService,
              private router: Router ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkLoggedIn();
  }

  checkLoggedIn(): boolean {
    console.log(this.loginService.isLoggedIn());
    if ( this.loginService.isLoggedIn()) {
      return true;
    }
    this.router.navigate([`/${ROUTES.LOGIN}`]);
    return false;
  }
}
