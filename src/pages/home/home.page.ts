import { ROUTES } from './../../router/routes';
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ModalVideoService } from '../../components/modal-video/modal-video.service';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { TypeDocumentsService } from '../../services/type-documents.service';


@Component({
  selector: 'home-page',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  public readonly termsLink: string = `/${ROUTES.TERMS}`;
  public readonly faqLink: string = `/${ROUTES.FAQ}`;
  public registerForm: FormGroup;
  public modalTermsIsOpen: boolean = false;
  public idCountry;
  public errorMessage = '';
  public showMessageEmail = false;
  public showSendEmail = false;
  private codeProduct = this.router.url.split('code=', 2)[1];
  private mainUrl = window.location.href;
  public typeDocumentsFilter;
  public typeDocuments;
  public errorTypeDocument = false;
  public documentId;
  private currentUrl;
  public errorMessageId;

  @ViewChild('checkBoxTerms', { read: ElementRef }) checkBoxTerms: ElementRef;
  constructor(private userService: UserService,
    private fb: FormBuilder,
    private modalService: ModalVideoService,
    private router: Router,
    private productsService: ProductsService,
    private typeDocumentsService: TypeDocumentsService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      'name': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'type-document-id': ['', Validators.required],
      'password': ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      'id-number': ['', [
        Validators.required
      ]],
      'password-confirmation': ['', [
        Validators.required,
        Validators.minLength(6),
        this.validatePasswordConfirm.bind(this)
      ]],
      'termsCheckbox': [true, [this.checkBoxRequired.bind(this)]]
    });

    this.currentUrl = window.location.href;
    if (this.currentUrl.includes('gt')) {
      this.loadTypeDocument(9);
    } else {
      this.loadTypeDocument(1);
    }
  }

 loadTypeDocument(idCountry) {
    const countryDocument = {
      'pais': idCountry
    } ;
    this.typeDocumentsService.getTypeDocument(countryDocument).subscribe((response) => {

      if(response.status == 0) {
        this.typeDocumentsFilter = response.body.documentType;
       }
    }, (error) => {
      console.log(error);
    });
  }
  filterDocuments(typeDocuments, idCountry) {
    const documents = typeDocuments.filter(
      typeDocument => typeDocument['country-id'] == idCountry
    );
    return documents;
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

/*
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
              Validators.pattern('^((\\d{6})|(\\d{8})|(\\d{10})|(\\d{12}))?$'),
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
          phoneNumberControl.setValidators([
            Validators.required,
            Validators.pattern(/^\d{10}$/)
          ]);
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
*/
  validatePasswordConfirm(registerGroup: FormGroup): any {
    if (this.registerForm) {
      return registerGroup.value === this.registerForm.get('password').value
        ? null
        : { match: true };
    }
  }

  checkBoxRequired(checkBox: FormGroup): any {
    return checkBox.value ? null : { noSelected: true };
  }

  openTermsModal(): void {
    this.modalTermsIsOpen = true;
  }

  closeModal() {
    this.modalTermsIsOpen = false;
  }

  acceptTerms(checkbox) {
    this.registerForm.patchValue({
      'termsCheckbox': true
    });
    checkbox.checked = true;
    this.closeModal();
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

  get formIsInValid() {
    return this.registerForm.invalid;
  }

  submitForm(form) {
    if (!this.formIsInValid) {
      const currentUrl = window.location.href;

      if (currentUrl.includes('gt')) {
        this.idCountry = 9;
      } else {
        this.idCountry = 1;
      }

      const params = {
        'pais': this.idCountry,
        'correo': this.registerForm.get('email').value,
        'nombres': this.registerForm.get('name').value,
        'contrasena': this.registerForm.get('password').value
      };

      this.userService.preSignup(params).subscribe(response => {
        this.showSendEmail = true;
        this.sendTokenShareProduct();
      }
        , error => {
          if (error.status) {
            this.errorMessage = error.error.message;
          }
        });

    } else {
      this.validateAllFormFields(this.registerForm);
    }
  }


  sendTokenShareProduct() {
    if (this.codeProduct && this.codeProduct !== 'na') {
      this.productsService.sendTokenShareProduct(this.codeProduct).subscribe(
        response => {
          if (response.status == 0) {
            /* const signup = `/${ROUTES.HOME}`;
             const showProduct = `/${ROUTES.PRODUCTS.LINK}/${
               ROUTES.PRODUCTS.SHOW
               }/${response.body.idProducto}`;
             const urlDetailProduct = this.mainUrl.replace(signup, showProduct);
             this.productsService.setUrlDetailProduct(urlDetailProduct);*/
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  removeError() {
    this.errorMessage = '';
  }

  reSendEmail() {
    if (!this.formIsInValid) {
      this.showMessageEmail = false;
      const params = {
        'pais': this.idCountry,
        'correo': this.registerForm.get('email').value
      };
      this.userService.reSendEmail(params).subscribe(response => {
        this.showMessageEmail = true;
      }, error => {
        console.log(error);
      });
    }
  }

  showVideo(id: string) {
    this.modalService.open(id);
  }

}
