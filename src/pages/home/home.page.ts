import { ROUTES } from './../../router/routes';
import { Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';


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
    @ViewChild('checkBoxTerms', { read: ElementRef }) checkBoxTerms: ElementRef;
    constructor( private userService: UserService,
      private fb: FormBuilder
      ) {}

    ngOnInit(): void {
        this.registerForm =  this.fb.group({
          'name': ['', [Validators.required]],
          'email': ['', [Validators.required, Validators.email]],
          'password': ['', [
            Validators.required,
            Validators.minLength(6)
          ]],
          'password-confirmation': ['', [
            Validators.required,
            Validators.minLength(6),
            this.validatePasswordConfirm.bind(this)
          ]],
          'termsCheckbox': ['', [this.checkBoxRequired.bind(this)]]
          });

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
        return this.registerForm.invalid ;
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
            'contrasena' : this.registerForm.get('password').value
          };

          this.userService.preSignup(params).subscribe(response => {
            this.showSendEmail = true;
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

      removeError() {
        this.errorMessage = '';
      }

      reSendEmail () {
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

}
