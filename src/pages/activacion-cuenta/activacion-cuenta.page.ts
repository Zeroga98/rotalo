import { ROUTES } from "./../../router/routes";
import { Router } from "@angular/router";
import { CurrentSessionService } from "./../../services/current-session.service";
import { ActivationService } from "./../../services/activation.service";
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { UserService } from "../../services/user.service";
import { SavePasswordService } from "../signup/save-password.service";

@Component({
  selector: 'app-activacion-cuenta',
  templateUrl: './activacion-cuenta.page.html',
  styleUrls: ['./activacion-cuenta.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivacionCuentaPage implements OnInit {
  errorRequest: Array<string> = [];
  private userCountry: any;
  constructor(
    private router: Router,
    private activationService: ActivationService,
    private currenSession: CurrentSessionService,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private savePassword: SavePasswordService
  ) {}

  ngOnInit() {
  }

  async activate(evt) {
    try {
      const response = await this.activationService.ejecuteActivation(evt.value.field);
      const userInfo = Object.assign({}, response, { id: response.id });
      this.gapush('send', 'event', 'Ingreso', 'ClicSignUp', 'CreacionCuentaExitosa');
      this.routineActivateSuccess(userInfo);
    } catch (error) {
      this.errorRequest = error.error.errors;
      this.changeDetectorRef.markForCheck();
    }
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

  private routineActivateSuccess(userInfo) {
    this.errorRequest = [];
    //this.currenSession.setSession(userInfo);
    //this.setUserCountry(userInfo);
    this.router.navigate([ROUTES.SUCCESS]);
    this.changeDetectorRef.markForCheck();
  }

  async setUserCountry(userInfo) {
      try {
        const user = await this.userService.getInfoUser();
        this.userCountry = user.city.state.country.id;
        const userLogin = Object.assign({}, userInfo, { countryId: this.userCountry });
        this.currenSession.setSession(userLogin);
        this.router.navigate([ROUTES.SUCCESS]);
      } catch (error) {
        console.error(error);
      }
    }
}
