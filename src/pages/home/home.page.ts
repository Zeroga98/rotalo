import { ROUTES } from './../../router/routes';
import { Component, OnInit} from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';


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
    constructor(
      ) {}


    ngOnInit(): void {
        this.registerForm = new FormGroup({
          'name': new FormControl('', [Validators.required]),
          email: new FormControl('', [Validators.required, Validators.email]),
          password: new FormControl('', [
            Validators.required,
            Validators.minLength(6)
          ]),
          'password-confirmation': new FormControl('', [
            Validators.required,
            Validators.minLength(6),
            this.validatePasswordConfirm.bind(this)
          ]),
          termsCheckbox: new FormControl('', [this.checkBoxRequired.bind(this)])
        });
    }

    validatePasswordConfirm(registerGroup: FormGroup): any {
        if (this.registerForm) {
          return registerGroup.value === this.registerForm.get('password').value
            ? null
            : { notSame: true };
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
        checkbox.checked = true;
        this.closeModal();
      }

}
