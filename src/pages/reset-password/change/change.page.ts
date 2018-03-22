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

  changePassword(newPassword: string, confirmNewPassword: string) {
    const user = {
      'data': {
        'type': 'passwords',
        'attributes': {
          'password': newPassword,
          'password-confirmation': confirmNewPassword,
          'token': this.idPassword
        }
      }
    };
    this.changePasswordService.changePassProfile(user).then(response => {
      this.messageChange = 'Su contraseña se ha actualizado correctamente.';
      this.errorChange = '';
      this.router.navigate([`${ROUTES.LOGIN}`]);
      })
      .catch(httpErrorResponse => {
        this.messageChange = '';
        if (httpErrorResponse.status === 403) {
        }
        if (httpErrorResponse.status === 404) {
          this.errorChange = '¡Codigo de seguridad no valido.';
        }
        if (httpErrorResponse.status === 422) {
          this.errorChange = httpErrorResponse.error.errors[0].title;
        }
        if (httpErrorResponse.status === 0) {
          this.errorChange = '¡No hemos podido conectarnos! Por favor intenta de nuevo.';
        }
      });
  }

}
