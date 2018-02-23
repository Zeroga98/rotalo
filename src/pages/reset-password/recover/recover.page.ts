import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RecoverService } from '../../../services/reset-password/recover.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../../router/routes';

@Component({
  selector: 'recover-page',
  templateUrl: 'recover.page.html',
  styleUrls: ['recover.page.scss']
})
export class RecoverPage implements OnInit {
  public recoverForm: FormGroup;
  public errorLogin: String;
  constructor(private recoverService: RecoverService,
    private router: Router) { }

  ngOnInit(): void {
    this.recoverForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }
  onSubmit() {
    if (this.recoverForm.valid) {
      const email = this.recoverForm.get('email').value;
      this.recover(email);
    }
  }
  recover(userEmail: string) {
    const user = {
      'data': {
        'type': 'recover',
        'attributes': {
          'email': userEmail
        }
      }
    };
    this.recoverService.recoverUser(user).then((response) => {
      this.router.navigate([`/${ROUTES.RESETPASS}/${ROUTES.CONFIRM}`]);
    }).catch((httpErrorResponse) => {
      if (httpErrorResponse.status ===  404) {
        this.errorLogin = httpErrorResponse.error.errors[0].title;
      }
    });
  }
}
