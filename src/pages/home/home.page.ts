import { ROUTES } from './../../router/routes';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ModalVideoService } from '../../components/modal-video/modal-video.service';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { TypeDocumentsService } from '../../services/type-documents.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalReactivateUserComponent } from '../../components/modal-reactivate-user/modal-reactivate-user.component';
import { ModalReactivateUserSuccessComponent } from '../../components/modal-reactivate-user-success/modal-reactivate-user-success.component';

function validateNameUser(
  name: AbstractControl
): { [key: string]: boolean } | null {
  const nameValue = name.value;
  const arrayName = nameValue.split(' ').filter(function (v) { return v !== ''; });
  if (arrayName.length == 1) {
    return { nameError: true };
  }
  return null;
}

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
  public modalReactivateIsOpen: boolean = false;
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
  public errorMessageDoc;
  public country = 'Colombia';
  public userEmail = '';
  public showReactivateModal = false;

  @ViewChild('checkBoxTerms', { read: ElementRef }) checkBoxTerms: ElementRef;
  constructor(private userService: UserService,
    private fb: FormBuilder,
    private modalService: ModalVideoService,
    private router: Router,
    private productsService: ProductsService,
    private typeDocumentsService: TypeDocumentsService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      'name': ['', [Validators.required, validateNameUser]],
      'email': ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
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
      'termsCheckbox': [true, [this.checkBoxRequired.bind(this)]],
      cellphone: ['', [Validators.required]]
    });

    this.currentUrl = window.location.href;
    if (this.currentUrl.includes('gt')) {
      this.loadTypeDocument(9);
      this.country = 'Guatemala';
    } else {
      this.loadTypeDocument(1);
      this.country = 'Colombia';
    }
    if (this.currentUrl.includes('email') && this.currentUrl.includes('code')) {
      this.getUrlParameters(this.currentUrl);
    }
    this.setValidationPhone(this.country);
    // this.openModalDeleteProduct();
  }

  setValidationPhone(country): void {
    if (country) {
      const idCountry = country;
      const phoneNumberControl = this.registerForm.get('cellphone');
      switch (idCountry) {
        case 'Colombia': {
          phoneNumberControl.setValidators([Validators.required]);
          this.registerForm.get('cellphone').setValidators([Validators.required]);
          phoneNumberControl.setValidators([
            Validators.required,
            Validators.pattern(/^\d{10}$/)
          ]);
          break;
        }
        case 'Guatemala': {
          phoneNumberControl.setValidators([
            Validators.required,
            Validators.pattern(/^\d{8}$/)
          ]);
          this.errorMessageId = 'El campo no cumple el formato.';
          break;
        }
        default: {
          phoneNumberControl.setValidators([Validators.required]);
          break;
        }
      }
      phoneNumberControl.updateValueAndValidity();
    }
  }

  loadTypeDocument(idCountry) {
    const countryDocument = {
      'pais': idCountry
    };
    this.typeDocumentsService.getTypeDocument(countryDocument).subscribe((response) => {
      if (response.status == 0) {
        this.typeDocumentsFilter = response.body.documentType;
      }
    }, (error) => {
      console.log(error);
    });
  }

  validateTypeDocument() {
    if (this.registerForm.get('type-document-id').value) {
      this.errorTypeDocument = false;
    }
  }

  findNameDocumentType() {
    let data;
    if (this.typeDocumentsFilter) {
      data = this.typeDocumentsFilter.find(resource => {
        return resource.id == this.documentId;
      });
    }
    return data;
  }

  setValidationId(): void {
    if (this.country) {
      const idDocumentControl = this.registerForm.get('id-number');
      const documentObject = this.findNameDocumentType();
      let documentName;
      if (documentObject) {
        documentName = documentObject['abrev'];
        idDocumentControl.clearValidators();
      }
      switch (this.country) {
        case 'Colombia': {
          if (documentName == 'CC') {
            idDocumentControl.setValidators([
              // Validators.pattern('^((\\d{6})|(\\d{8})|(\\d{10})|(\\d{12}))?$'),
              Validators.maxLength(10),
              Validators.pattern('^[0-9]+$'),
              Validators.required
            ]);
            this.errorMessageId =
              'El campo no cumple con el formato de cédula.';
          } else if (documentName == 'CE') {
            idDocumentControl.setValidators([
              Validators.minLength(3),
              Validators.maxLength(15),
              Validators.pattern('^[0-9]+$'),
              Validators.required
            ]);
            this.errorMessageId =
              'El campo no cumple con el formato de cédula.';
          } else if (documentName == 'PA') {
            idDocumentControl.setValidators([
              Validators.minLength(5),
              Validators.maxLength(36),
              Validators.required
            ]);
            this.errorMessageId =
              'El campo no cumple con el formato de Pasaporte.';
          }
          break;
        }
        case 'Guatemala': {
          idDocumentControl.setValidators([
            // Validators.pattern('^[0-9]{4}\\s?[0-9]{5}\\s?[0-9]{4}$'),
            Validators.pattern('^[0-9]{13}$'),
            Validators.required
          ]);
          this.errorMessageId = 'El campo no cumple el formato.';
          break;
        }
        default: {
          idDocumentControl.setValidators([Validators.required]);
          break;
        }
      }
      idDocumentControl.updateValueAndValidity();
    }
  }

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
  openReactivateModal(): void {
    this.modalReactivateIsOpen = true;
  }

  closeReactivateModal() {
    this.modalReactivateIsOpen = false;
  }

  closeModalReactivate() {
    this.modalTermsIsOpen = false;
  }

  acceptTerms(checkbox) {
    this.registerForm.patchValue({
      'termsCheckbox': true
    });
    // checkbox.checked = true;
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

      this.userEmail = this.registerForm.get('email').value.toLowerCase();

      const idDocument: number = +this.registerForm.get('type-document-id').value;
      const params = {
        'pais': this.idCountry,
        'correo': this.registerForm.get('email').value.toLowerCase(),
        'nombres': this.registerForm.get('name').value,
        'contrasena': this.registerForm.get('password').value,
        'idTipoDocumento': idDocument,
        'documento': this.registerForm.get('id-number').value,
        'celular': this.registerForm.get('cellphone').value
      };

      this.userService.preSignup(params).subscribe(response => {
        this.showSendEmail = true;
        this.sendTokenShareProduct();
      }
        , error => {
          console.log(error);
          if (error.error) {
            if (error.error.status == '603' || error.error.status == '604'
              || error.error.status == '608' || error.error.status == '606') {
              this.errorMessage = error.error.message;
              this.errorMessageDoc = '';
            } else if (error.error.status == '612' || error.error.status == '613') {
              this.errorMessage = '';
              this.errorMessageDoc = error.error.message;
            }
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
    this.errorMessageDoc = '';
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

  getUrlParameters(url) {
    let data;
    let email = '';
    let code = '';
    data = url.split('?');
    data = data[1];
    data = data.split('&');
    data[0] = data[0].split('email=');
    data[1] = data[1].split('code=');
    email = data[0][1];
    email = email.replace('%20', '+');
    code = data[1][1];
    this.validateParametersUrl(email, code);
  }


  validateParametersUrl(email, code) {
    if (true) {
      this.openDialogReactivateSuccess();
    }
  }

  openDialogReactivateSuccess(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '300px';
    dialogConfig.maxWidth = '900px';
    // dialogConfig.height = '600px';
    dialogConfig.width = '55%';
    dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = false;
    // dialogConfig.data = this.loginForm.get('email').value.toLowerCase();
    const dialogRef = this.dialog.open(ModalReactivateUserSuccessComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // this.onSubmit();
    });
  }

}
