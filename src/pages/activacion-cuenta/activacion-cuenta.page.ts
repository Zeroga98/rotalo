import { ROUTES } from './../../router/routes';
import { Router } from '@angular/router';
import { CurrentSessionService } from './../../services/current-session.service';
import { ActivationService } from './../../services/activation.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SavePasswordService } from '../signup/save-password.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-activacion-cuenta',
  templateUrl: './activacion-cuenta.page.html',
  styleUrls: ['./activacion-cuenta.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivacionCuentaPage implements OnInit {
  errorRequest: Array<string> = [];
  private userCountry: any;
  public errorLogin;
  constructor(
    private router: Router,
    private activationService: ActivationService,
    private currenSession: CurrentSessionService,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private savePassword: SavePasswordService,
    private messagesService: MessagesService
  ) {}

  ngOnInit() {
  }

  activate(evt) {
    const params = {
      'activationCode' : evt.value.field
    };
    this.activationService.activateCount(params).then(response => {
        if (response.status === 200) {
          this.gapush('send', 'event', 'Ingreso', 'ClicSignUp', 'CreacionCuentaExitosa');
          const saveInfo = {
            'auth-token': response.body.data.token,
            email: response.body.data.userProperties.email,
            id: response.body.data.userProperties.roles[0],
            'id-number': response.body.data.userProperties.identification,
            name: response.body.data.userProperties.fullname,
            photo: {
              id: ' ',
              url: ' '
            }
          };
          this.routineActivateSuccess(saveInfo);
        }
        if (response.status === 401) {
          this.errorLogin = "Usuario o contraseña incorrecto.";
        }
        if (response.status === 500) {
          this.errorLogin =
            "¡El código de activación no es válido.";
        }
        this.changeDetectorRef.markForCheck();
    }) .catch(httpErrorResponse => {
      console.error(httpErrorResponse);
      if (httpErrorResponse.status === 401) {
        this.errorLogin = 'No puede tener más de 1 sesión activas.';
      }
      if (httpErrorResponse.status === 403) {
      }
      if (httpErrorResponse.status === 422) {
        this.errorLogin = httpErrorResponse.error.errors[0].title;
      }
      if (httpErrorResponse.status === 0 && httpErrorResponse.status === 500) {
        this.errorLogin =
          '¡No hemos podido conectarnos! Por favor intenta de nuevo.';
      }
      this.changeDetectorRef.markForCheck();
    });
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

  private checkNotificationHobbies(idUser) {
    this.messagesService.checkNotificationHobbies(idUser)
     .subscribe(
       state => {
       },
       error => console.log(error)
     );
   }

  private routineActivateSuccess(userInfo) {
    this.errorRequest = [];
    this.errorLogin = '';
    this.currenSession.setSession(userInfo);
    this.setUserCountry(userInfo);
    this.checkNotificationHobbies(userInfo.id);
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
