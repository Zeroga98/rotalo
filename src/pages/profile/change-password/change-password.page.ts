import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ChangePasswordService } from '../../../services/profile/changePassword.service';

function passwordMatcher(c: AbstractControl): {[key: string]: boolean} | null {
  let newPassword = c.get('newPassword');
  let confirmNewPassword = c.get('confirmNewPassword');

  if (newPassword.pristine || confirmNewPassword.pristine) {
    return null;
  }

  if (newPassword.value === confirmNewPassword.value) {
      return null;
  }
  return { 'match': true };
}

@Component({
  selector: 'change-password',
  templateUrl: 'change-password.page.html',
  styleUrls: ['change-password.page.scss']
})
export class ChangePasswordPage implements OnInit {
  public changePasswordForm: FormGroup;
  public errorChange: String;
  public messageChange: String;


  constructor(private fb: FormBuilder, private changePasswordService: ChangePasswordService) {}

  ngOnInit(): void {
    this.changePasswordForm =  this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]]
      }, {validator: passwordMatcher});
  }

  onSubmit() {
    const currentPassword = this.changePasswordForm.get('currentPassword').value;
    const newPassword = this.changePasswordForm.get('newPassword').value;
    const confirmNewPassword = this.changePasswordForm.get('confirmNewPassword').value;
    this.changePassword(currentPassword, newPassword , confirmNewPassword);
  }

  changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string) {
    const user = {
      'data': {
        'type': 'passwords',
        'attributes': {
          'password': currentPassword,
          'new-password': newPassword,
          'new-password-confirmation': confirmNewPassword
        }
      }
    };
    this.changePasswordService.changePass(user).then(response => {
      this.messageChange = 'Su contraseña se ha actualizado correctamente.';
      this.errorChange = '';
      })
      .catch(httpErrorResponse => {
        this.messageChange = '';
        if (httpErrorResponse.status === 403) {
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
