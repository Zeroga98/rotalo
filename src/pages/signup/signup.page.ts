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

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private typeDocumentsService: TypeDocumentsService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      'type-document-id': new FormControl('', null),
      'id-number': new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
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

  async onSubmit() {
    try {
      if (this.registerForm.valid) {
        const params = this.buildParamsUserRequest();
        console.log(params);
        this.userService.signup(params).subscribe(
          response => {
            // this.savePassword.setPassword(this.registerForm.get('password').value);
            this.errorsSubmit = [];
          //  this.sendTokenShareProduct();
            // this.router.navigate([ROUTES.ACTIVACION]);
            //  this.router.navigate([`${ROUTES.SIGNUP}/${ROUTES.ACTIVACION}`]);
          },
          error => {
            console.log(error);
          }
        );
      }
    } catch (error) {
      this.errorsSubmit = error.error.errors;
    }
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
      idDocumentControl.clearValidators();
      phoneNumberControl.clearValidators();
      const documentObject = this.findNameDocumentType();
      let documentName;
      if (documentObject) {
        documentName = documentObject['name-document'];
      }

      /* Los id de los documentos estan 1,4,5 en el administrador de pruebas */
      switch (idCountry) {
        case 'Colombia': {
          if (documentName === 'Cédula de ciudadanía') {
            idDocumentControl.setValidators([
              Validators.pattern('^((\\d{7})|(\\d{8})|(\\d{10})|(\\d{11}))?$'),
              Validators.required
            ]);
            this.errorMessageId =
              'El campo no cumple con el formato de cédula.';
          } else if (documentName === 'Cédula de extranjería') {
            idDocumentControl.setValidators([
              Validators.minLength(3),
              Validators.maxLength(15),
              Validators.pattern('^[0-9]+$'),
              Validators.required
            ]);
            this.errorMessageId =
              'El campo no cumple con el formato de cédula.';
          } else if (documentName === 'Pasaporte') {
            idDocumentControl.setValidators([
              Validators.minLength(5),
              Validators.maxLength(36),
              Validators.required
            ]);
            this.errorMessageId =
              'El campo no cumple con el formato de Pasaporte.';
          }
          phoneNumberControl.setValidators([Validators.required]);
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
            Validators.pattern('^[0-9]{4}\\s[0-9]{5}\\s[0-9]{4}$'),
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
}
