import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { CurrentSessionService } from "../../services/current-session.service";
import { ROUTES } from "../routes";
import { SessionUserInterface } from "../../commons/interfaces/session.interface";


@Injectable()
export class ValidateSessionService implements CanActivate {

  constructor(private currentSessionService: CurrentSessionService, private router: Router) {}

  canActivate() {
    if(this.checkSession()){
        this.router.navigate([`${ROUTES.PRODUCTS.LINK}`]);
        return false;
    }
    return true;
  }

  private checkSession(): SessionUserInterface{
    return this.currentSessionService.currentUser();
  }

}