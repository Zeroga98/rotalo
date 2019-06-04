import { ROUTES } from './../../router/routes';
import { UtilsService } from './../../util/utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { ActivationService } from '../../services/activation.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { MessagesService } from '../../services/messages.service';
import { CollectionSelectService } from '../../services/collection-select.service';
import { TypeDocumentsService } from '../../services/type-documents.service';

@Component({
  selector: 'signup-page',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss']
})
export class SignUpPage implements OnInit {
  public errorsSubmit: Array<any> = [];
  public modalTermsIsOpen: boolean = false;
  public registerForm: FormGroup;
  public country;
  public city;
  public state;
  public documentId;
  public errorMessageId;
  public typeDocuments;
  public typeDocumentsFilter;
  public paramsUrl;
  public codeSignup;
  public errorState = false;
  public errorCity = false;
  public errorTypeDocument= false;
  public errorRequest: Array<string> = [];
  public errorLogin;
  private userCountry: any;
  public errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private activationService: ActivationService,
    private currenSession: CurrentSessionService,
    private messagesService: MessagesService,
    private utilsService: UtilsService,
    private collectionService: CollectionSelectService,
  ) {

  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl({value: '', disabled: true}, [Validators.required]),
      identification: new FormControl({value: '', disabled: true}, [Validators.required]),
      email: new FormControl({value: '', disabled: true}, [Validators.required, Validators.email])
    });
    this.getCountries();
  }

  setCountry(idCountry) {
    if (idCountry == '1') {
      this.country = {
        name: 'Colombia',
        id: '1'
      };
    } else if (idCountry == '9')  {
      this.country = {
        name: 'Guatemala',
        id: '9'
      };
    }
  }

  async getCountries() {
    try {
      await this.collectionService.isReady();
      this.route.queryParamMap.subscribe(params => {
        this.paramsUrl = params['params'];
        this.setCountry(this.paramsUrl.country);
        let email = this.paramsUrl.email;
        email = email.replace(' ', '+');
        email = email.replace(/\s+/g, '+');
        this.registerForm.patchValue({ name: this.paramsUrl.name });
        this.registerForm.patchValue({ email: email });
        this.registerForm.patchValue({ identification: this.paramsUrl.documentType + ' ' + this.paramsUrl.document });
        this.codeSignup =  this.paramsUrl.code;
        this.userCountry = this.paramsUrl.country;
      });
    } catch (error) {
      console.error(error);
    }
  }


  filterDocuments(typeDocuments, idCountry) {
    const documents = typeDocuments.filter(
      typeDocument => typeDocument['country-id'] == idCountry
    );
    return documents;
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
  }

  async setUserCountry(userInfo) {
      try {
        this.currenSession.setSession(userInfo);
        this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`]);
        /*if (this.productsService.getUrlDetailProduct()) {
          window.location.replace(this.productsService.getUrlDetailProduct());
         } else {
          this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`]);
          // location.reload();
         }*/
      } catch (error) {
        console.error(error);
      }
  }

  activate() {
    const params = {
      'activationCode' : this.codeSignup
    };
    this.activationService.activateCount(params).then(response => {
        if (response.status === 200) {
          this.gapush('send', 'event', 'Ingreso', 'ClicSignUp', 'CreacionCuentaExitosa');
          const saveInfo = {
            'auth-token': response.body.data.token,
            email: response.body.data.userProperties.email,
            id: response.body.data.userProperties.roles[0],
            rol: response.body.data.userProperties.roles[1],
            'id-number': response.body.data.userProperties.identification,
            name: response.body.data.userProperties.fullname,
            countryId:  this.userCountry,
            photo: {
              id: ' ',
              url: ' '
            }
          };
          this.routineActivateSuccess(saveInfo);
        }
        if (response.status === 401) {
          // this.errorLogin =  '¡El código de activación no es válido.';
        }
        if (response.status === 500) {
          // this.errorLogin ='¡El código de activación no es válido.';
        }
    }) .catch(httpErrorResponse => {
      console.error(httpErrorResponse);
    });
  }

  async onSubmit() {
      if (!this.formIsInvalid) {
        const params = this.buildParamsUserRequest();
        this.userService.signup(params).subscribe(
          response => {
            this.errorsSubmit = [];
            this.errorMessage = '';
          //  this.sendTokenShareProduct();
            this.activate();
          },
          error => {
            if (error.status) {
              console.log(error.status);
              this.errorMessage = error.error.message;
              this.utilsService.goToTopWindow(20, 600);
            }
          }
        );
      } else {
        this.validateAllFormFields(this.registerForm);
        if (this.state && !this.state['id']) {
          this.errorState = true;
        }
        if (this.state && !this.city['id']) {
          this.errorCity = true;
        }
      }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
       control.markAsDirty({ onlySelf: true });
       control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  buildParamsUserRequest() {
    const params = {
      'idCiudad': this.city['id'],
      'codigoActivacion': this.codeSignup
    };
    return params;
  }

  selectedCountry(ev) {
    this.country = ev;
  }

  selectedStates(ev) {
    this.state = ev;
  }

  get formIsInvalid(): boolean {
    return this.registerForm.invalid || !this.selectIsCompleted();
  }

  private selectIsCompleted(): boolean {
    if (this.country && this.state && this.city) {
      if (this.country['id'] && this.state['id'] && this.city['id']) {
        return true;
      }
    }
    return false;
  }

  validateState() {
    if (this.state && this.state['id']) {
      this.errorState = false;
    }
  }

  validateCity() {
    if (this.state &&  this.city['id']) {
      this.errorCity = false;
    }
  }
}
