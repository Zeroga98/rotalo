import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ChangePasswordService } from '../../../services/profile/changePassword.service';
import {ActivatedRoute, Router} from "@angular/router";
import { ROUTES } from '../../../router/routes';

function passwordMatcher(c: AbstractControl): {[key: string]: boolean} | null {
  let newPassword = c.get('password');
  let confirmNewPassword = c.get('password-confirmation');

  if (newPassword.pristine || confirmNewPassword.pristine) {
    return null;
  }

  if (newPassword.value === confirmNewPassword.value) {
      return null;
  }
  return { 'match': true };
}

@Component({
  selector: 'app-change',
  templateUrl: './change.page.html',
  styleUrls: ['./change.page.scss']
})
export class ChangePage implements OnInit {
  public changePasswordForm: FormGroup;
  public errorChange: String;
  public messageChange: String;
  public showLink = false;
  private idPassword;

  constructor( private router: Router,
     private route: ActivatedRoute,
     private fb: FormBuilder,
     private changePasswordService: ChangePasswordService) {
      this.route.params.subscribe( params => this.idPassword = params.id );
    }

  ngOnInit(): void {
    this.changePasswordForm =  this.fb.group({
      'password': ['', [Validators.required, Validators.minLength(6)]],
      'password-confirmation': ['', [Validators.required, Validators.minLength(6)]]
      }, {validator: passwordMatcher});
  }

  onSubmit() {
    const newPassword = this.changePasswordForm.get('password').value;
    const confirmNewPassword = this.changePasswordForm.get('password-confirmation').value;
    this.changePassword(newPassword , confirmNewPassword);
  }

  markAsTouched(control) {
    control.markAsTouched();
  }

  changePassword(newPassword: string, confirmNewPassword: string) {
    const currentUrl = window.location.href;
    let idCountry;
    if (currentUrl.includes('gt')) {
      idCountry = 9;
    } else {
      idCountry = 1;
    }
    const params = {
     'pais': idCountry,
     'contrasena': newPassword,
     'token': this.idPassword
    };

    this.changePasswordService.changePassProfile(params).subscribe((reponse) => {
      this.messageChange = 'Su contraseña se ha actualizado correctamente.';
      this.errorChange = '';
      this.showLink = true;
      alert('Su contraseña se ha actualizado correctamente.');
      this.gapush(
        'send',
        'event',
        'Ingreso',
        'ClicLogin',
        'GuardarTuContraseniaExitoso'
      );
      this.router.navigate([`${ROUTES.HOME}`]);
    },
    (error) => {
      this.errorChange = error.error.message;
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

}
