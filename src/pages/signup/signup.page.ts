import { ROUTES } from './../../router/routes';
import { UtilsService } from './../../util/utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserInterface } from './../../commons/interfaces/user.interface';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserRequestInterface } from '../../commons/interfaces/user-request.interface';
import { TypeDocumentsService } from '../../services/type-documents.service';
import { SavePasswordService } from './save-password.service';
import { ProductsService } from '../../services/products.service';
import { ActivationService } from '../../services/activation.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { MessagesService } from '../../services/messages.service';

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
  private mainUrl = window.location.href;
  private codeProduct = this.router.url.split('code=', 2)[1];
  public paramsUrl;
  public codeSignup;
  public errorState = false;
  public errorCity = false;
  public errorTypeDocument= false;
  public errorRequest: Array<string> = [];
  public errorLogin;
  private userCountry: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private typeDocumentsService: TypeDocumentsService,
    private productsService: ProductsService,
    private activationService: ActivationService,
    private currenSession: CurrentSessionService,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl({value: '', disabled: true}, [Validators.required]),
      'type-document-id': new FormControl('', null),
      'id-number': new FormControl('', [Validators.required]),
      email: new FormControl({value: '', disabled: true}, [Validators.required, Validators.email]),
      cellphone: new FormControl('', [Validators.required])
    });
    this.route.queryParamMap.subscribe(params => {
      this.paramsUrl = params['params'];
      this.setCountry(this.paramsUrl.country);
      let email = this.paramsUrl.email;
      email = email.replace(' ', '+');
      email = email.replace(/\s+/g, '+');
      this.registerForm.patchValue({ name: this.paramsUrl.name });
      this.registerForm.patchValue({ email: email });
      this.codeSignup =  this.paramsUrl.code;
      this.userCountry = this.paramsUrl.country;
      this.loadTypeDocument(this.paramsUrl.country);
    });
  }

  setCountry(idCountry) {
    if (idCountry == '1') {
      this.country = {
        name: 'Colombia',
        id: '1'
      };
    } else {
      this.country = {
        name: 'Guatemala',
        id: '9'
      };
    }
  }

  async loadTypeDocument(idCountry) {
    try {
      this.typeDocuments = await this.typeDocumentsService.getTypeDocument();
      this.typeDocumentsFilter = this.filterDocuments(
        this.typeDocuments, idCountry
      );
    } catch (error) {
      console.log(error);
    }
  }

  filterDocuments(typeDocuments, idCountry) {
    const documents = typeDocuments.filter(
      typeDocument => typeDocument['country-id'] == idCountry
    );
    return documents;
  }

  sendTokenShareProduct() {
    if (this.codeProduct && this.codeProduct !== 'na') {
      this.productsService.sendTokenShareProduct(this.codeProduct).subscribe(
        response => {
          if (response.status == 0) {
            const signup = `/${ROUTES.SIGNUP}`;
            const showProduct = `/${ROUTES.PRODUCTS.LINK}/${
              ROUTES.PRODUCTS.SHOW
            }/${response.body.idProducto}`;
            const urlDetailProduct = this.mainUrl.replace(signup, showProduct);
            this.productsService.setUrlDetailProduct(urlDetailProduct);
          }
        },
        error => {
          console.log(error);
        }
      );
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
        /* const user = await this.userService.getInfoUser();
        if (user.city.state.country.id) {
          this.userCountry = user.city.state.country.id;
        }
        const userLogin = Object.assign({}, userInfo, { countryId: this.userCountry });
        this.currenSession.setSession(userLogin); */
        this.currenSession.setSession(userInfo);
        this.router.navigate([
          `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
        ]);
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
        console.log(params);
        this.userService.signup(params).subscribe(
          response => {
            this.errorsSubmit = [];
          //  this.sendTokenShareProduct();
            this.activate();
          },
          error => {
            console.log(error);
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
        if (!this.registerForm.get('type-document-id').value) {
          this.errorTypeDocument = true;
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
      'idTipoDocumento': this.registerForm.get('type-document-id').value,
      'numeroDocumento': this.registerForm.get('id-number').value,
      'celular': this.registerForm.get('cellphone').value,
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

  setValidationId(): void {
    if (this.country) {
      const idCountry = this.country.name;
      const idDocumentControl = this.registerForm.get('id-number');
      const phoneNumberControl = this.registerForm.get('cellphone');
      const documentObject = this.findNameDocumentType();
      let documentName;
      if (documentObject) {
        documentName = documentObject['name-document'];
        idDocumentControl.clearValidators();
        phoneNumberControl.clearValidators();
      }
      switch (idCountry) {
        case 'Colombia': {
          if (documentName == 'Cédula de ciudadanía') {
            idDocumentControl.setValidators([
              Validators.pattern('^((\\d{4})|(\\d{8})|(\\d{10})|(\\d{12}))?$'),
              Validators.required
            ]);
            this.errorMessageId =
              'El campo no cumple con el formato de cédula.';
          } else if (documentName == 'Cédula de extranjería') {
            idDocumentControl.setValidators([
              Validators.minLength(3),
              Validators.maxLength(15),
              Validators.pattern('^[0-9]+$'),
              Validators.required
            ]);
            this.errorMessageId =
              'El campo no cumple con el formato de cédula.';
          } else if (documentName == 'Pasaporte') {
            idDocumentControl.setValidators([
              Validators.minLength(5),
              Validators.maxLength(36),
              Validators.required
            ]);
            this.errorMessageId =
              'El campo no cumple con el formato de Pasaporte.';
          }
          phoneNumberControl.setValidators([Validators.required]);
          this.registerForm.get('cellphone').setValidators([Validators.required]);
          break;
        }
        case 'Panama': {
          idDocumentControl.setValidators([
            Validators.pattern(
              '^(PE|E|N|[23456789](?:AV|PI)?|1[0123]?(?:AV|PI)?)-(\\d{1,4})-(\\d{1,5})$'
            ),
            Validators.required
          ]);
          phoneNumberControl.setValidators([Validators.required]);
          this.errorMessageId = 'El campo no cumple con el formato.';
          break;
        }
        case 'Guatemala': {
          idDocumentControl.setValidators([
           // Validators.pattern('^[0-9]{4}\\s?[0-9]{5}\\s?[0-9]{4}$'),
           Validators.pattern('^[0-9]{13}$'),
            Validators.required
          ]);
          phoneNumberControl.setValidators([
            Validators.required,
            Validators.pattern(/^\d{8}$/)
          ]);
          this.errorMessageId = 'El campo no cumple el formato.';
          break;
        }
        default: {
          idDocumentControl.setValidators([Validators.required]);
          phoneNumberControl.setValidators([Validators.required]);
          break;
        }
      }
      idDocumentControl.updateValueAndValidity();
      phoneNumberControl.updateValueAndValidity();
    }
  }

  findNameDocumentType() {
    let data;
    if (this.typeDocuments) {
      data = this.typeDocuments.find(resource => {
        return resource.id === this.documentId;
      });
    }
    return data;
  }

  validateTypeDocument() {
    if (this.registerForm.get('type-document-id').value) {
      this.errorTypeDocument = false;
    }
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
