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
  public errorStatus: String;
  public email: String;
  constructor(private recoverService: RecoverService,
    private router: Router) { }

  ngOnInit(): void {
    this.recoverForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)])
    });
  }
  onSubmit() {
    if (this.recoverForm.valid) {
      const email = this.recoverForm.get('email').value;
      this.recover(email);
    }
  }
  recover(userEmail: string) {
    const currentUrl = window.location.href;
    let idCountry;
    if (currentUrl.includes('gt')) {
      idCountry = 9;
    } else {
      idCountry = 1;
    }
    const params = {
     'pais': idCountry,
     'correo': userEmail
    };
    this.recoverService.recoverUser(params).subscribe(
      (response) => {
        this.errorStatus = '200';
        this.email = userEmail;
        this.gapush(
          'send',
          'event',
          'Ingreso',
          'ClicLogin',
          'RecuperaTuContraseniaCorp'
        );
      },
      (error) => {
        if(error.error.status==603){
          this.errorStatus = error.error.status;
          this.gapush(
            'send',
            'event',
            'Ingreso',
            'ClicLogin',
            'RecuperaTuContraseniaNoCorp'
          );
        }
        if(error.error.status==607){
          this.errorStatus = error.error.status;
        }
        if(error.error.status==609){
          this.errorStatus = error.error.status;
          this.gapush(
            'send',
            'event',
            'Ingreso',
            'ClicLogin',
            'RecuperaTuContraseniaNoRegist'
          );
        }
        if(error.error.status==610){
          this.errorStatus = error.error.status;
        }
      }
    );
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

  goToHome() {
    const url = `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`;
    const urlMicrositeProduct = `${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}`;
    const urlMicrosite = `/${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.FEED}`;
    if (this.router.url.includes(urlMicrositeProduct) && urlMicrosite != this.router.url) {
      this.router.navigate([urlMicrosite]);
    } else {
      `/${url}` === this.router.url ? location.reload() : this.router.navigate([url]);
    }
  }
}
