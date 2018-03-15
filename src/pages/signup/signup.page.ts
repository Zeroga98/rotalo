import { ROUTES } from './../../router/routes';
import { UtilsService } from './../../util/utils.service';
import { Router } from '@angular/router';
import { UserInterface } from './../../commons/interfaces/user.interface';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,  Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { UserRequestInterface } from '../../commons/interfaces/user-request.interface';
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
    constructor(
        private userService: UserService,
        private router: Router,
        private utilsService: UtilsService,
        private typeDocumentsService: TypeDocumentsService) {}

    ngOnInit(): void {
        this.registerForm = new FormGroup({
            'first-name': new FormControl('', [Validators.required]),
            'last-name': new FormControl('', [Validators.required]),
            'type-document-id': new FormControl('', null),
            'id-number': new FormControl('', [Validators.required]),
            email: new FormControl('', [ Validators.required, Validators.email]),
            cellphone: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            'password-confirmation': new FormControl('', [Validators.required, Validators.minLength(6),
              this.validatePasswordConfirm.bind(this)]),
            termsCheckbox: new FormControl('', [this.checkBoxRequired.bind(this)])
        });
        this.loadTypeDocument();
    }

    async onSubmit() {
        try {
          if (this.registerForm.valid) {
            const params: UserRequestInterface = this.buildParamsUserRequest();
            const response = await this.userService.saveUser(params);
            this.errorsSubmit = [];
            this.router.navigate([ROUTES.ACTIVACION]);
          }
        } catch (error) {
            this.errorsSubmit = error.error.errors;
            this.utilsService.goToTopWindow(20, 600);
        }
    }

    async loadTypeDocument() {
        try {
         this.typeDocuments = await this.typeDocumentsService.getTypeDocument();
         console.log(this.typeDocuments);
        } catch (error) {}
    }

    buildParamsUserRequest(): UserRequestInterface {
        const fullName = `${this.registerForm.get('first-name').value} ${this.registerForm.get('last-name').value}`;
        delete  this.registerForm.value['first-name'];
        delete  this.registerForm.value['last-name'];
        //delete  this.registerForm.value['type-number'];
        const params = Object.assign({}, this.registerForm.value, {'name': fullName}, {'city-id': this.city.id});
        delete params.termsCheckbox;
        return params;
    }

    selectedCountry(ev) {
        this.country = ev;
    }

    selectedStates(ev) {
        this.state = ev;
    }

    selectedCountryColombia(): boolean {
      if (this.country && this.country.id === "1" && this.country.name === "Colombia") {
        return true;
      }
      return false;
    }

    checkBoxRequired(checkBox: FormGroup): any {
        return checkBox.value ? null : { noSelected: true};
    }

    validatePasswordConfirm(registerGroup: FormGroup): any {
        if (this.registerForm) {
            return registerGroup.value === this.registerForm.get('password').value ? null : { notSame: true};
        }
    }

    get formIsInValid(): boolean{
        return this.registerForm.invalid || !this.selectIsCompleted();
    }

    private selectIsCompleted(): boolean {
        return this.country && this.state && this.city;
    }

    openTermsModal(): void {
        this.modalTermsIsOpen = true;
    }

    closeModal() {
        this.modalTermsIsOpen = false;
    }

    acceptTerms(checkbox) {
        checkbox.checked = true;
        this.closeModal();
    }

    setValidationId(): void {
      if (this.country) {
       const idCountry = this.country.id;
       const idDocumentControl = this.registerForm.get('id-number');
       idDocumentControl.clearValidators();
       /* Los id de los documentos estan 1,4,5 en el administrador de pruebas */
        switch (idCountry) {
          case '1': {
            if (this.documentId === '1') {
              idDocumentControl.setValidators([Validators.pattern('^((\\d{7})|(\\d{8})|(\\d{10})|(\\d{11}))?$'),
              Validators.required]);
              this.errorMessageId = "El campo no cumple con el formato de cédula.";
            }else if (this.documentId === '4') {
              idDocumentControl.setValidators([Validators.minLength(3),
              Validators.maxLength(15),
              Validators.pattern('^[0-9]+$'),
              Validators.required]);
              this.errorMessageId = "El campo no cumple con el formato de cédula.";
            }else if (this.documentId === '5') {
              idDocumentControl.setValidators([Validators.minLength(5),
              Validators.maxLength(36),
              Validators.required]);
              this.errorMessageId = "El campo no cumple con el formato de Pasaporte.";
            }
             break;
          }
          case '2': {
            idDocumentControl.setValidators([Validators.pattern('^(PE|E|N|[23456789](?:AV|PI)?|1[0123]?(?:AV|PI)?)-(\\d{1,4})-(\\d{1,5})$'),
            Validators.required]);
            this.errorMessageId = "El campo no cumple con el formato.";
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
}
