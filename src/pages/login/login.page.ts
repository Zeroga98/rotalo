import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { LoginService } from '../../services/login/login.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login-page',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public errorLogin: String;
  constructor(private loginService: LoginService, private currentSessionService: CurrentSessionService,
    private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }
  onSubmit() {

    if (this.loginForm.valid) {
      const email = this.loginForm.get('email').value;
      const password = this.loginForm.get('password').value;
      this.login(email, password);
    }
  }
  login(userEmail: string, password: string) {
    const user = {
      'data': {
        'type': 'sessions',
        'attributes': {
          'email': userEmail,
          'password': password
        }
      }
    };
    this.loginService.loginUser(user).then((response) => {
      this.currentSessionService.setSession(response.data);
      this.router.navigate(['/products/feed']);
    }).catch((httpErrorResponse) => {
        if (httpErrorResponse.status === 403) {
        }
        if (httpErrorResponse.status ===  422) {
          this.errorLogin = httpErrorResponse.error.errors[0].title;
        }
        if (httpErrorResponse.status === 0) {
          this.errorLogin = '¡No hemos podido conectarnos! Por favor intenta de nuevo.';
        }
    });
  }
}
