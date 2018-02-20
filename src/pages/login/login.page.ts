import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { LoginService } from '../../services/login/login.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { Router } from '@angular/router';

@Component({
  selector: "login-page",
  templateUrl: "login.page.html",
  styleUrls: ["login.page.scss"]
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
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
      let email = this.loginForm.get('email').value;
      let password = this.loginForm.get('password').value;
      this.login(email, password);
    }
  }
  login(userName: string, password: string) {
    const user = {
      'data': {
        'type': 'sessions',
        'attributes': {
          'email': userName,
          'password': password
        }
      }
    };
    this.loginService.loginUser(user).then((response) => {
      this.currentSessionService.setSession(response.data);
      this.currentSessionService.authToken();
      this.router.navigate(['/products-feed']);
      console.log('Testeo');
      }).catch((error) => {
        console.log("error");
        console.log(error);
      });
  }
}
