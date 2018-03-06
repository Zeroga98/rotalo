import { ROUTES } from './../../router/routes';
import { UtilsService } from './../../util/utils.service';
import { Router } from '@angular/router';
import { UserInterface } from './../../commons/interfaces/user.interface';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,  Validators } from '@angular/forms';
import { UserRequestInterface } from '../../commons/interfaces/user-request.interface';

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

    constructor(
        private userService:UserService,
        private router: Router,
        private utilsService: UtilsService) {}

    ngOnInit(): void {
        this.registerForm = new FormGroup({
            'first-name': new FormControl('', [Validators.required]),
            'last-name': new FormControl('', [Validators.required]),
            'type-number': new FormControl('', null),
            'id-number': new FormControl('', [Validators.required]),
            email: new FormControl('', [ Validators.required, Validators.email]),
            cellphone: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            'password-confirmation': new FormControl('', [Validators.required, Validators.minLength(6),
              this.validatePasswordConfirm.bind(this)]),
            termsCheckbox: new FormControl('', [this.checkBoxRequired.bind(this)])
        });
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

    buildParamsUserRequest(): UserRequestInterface {
        const fullName = `${this.registerForm.get('first-name').value} ${this.registerForm.get('last-name').value}`;
        delete  this.registerForm.value['first-name'];
        delete  this.registerForm.value['last-name'];
        delete  this.registerForm.value['type-number'];
        const params = Object.assign({}, this.registerForm.value, {'name': fullName}, {'city-id': this.city.id});
        delete params.termsCheckbox;
        console.log(params);
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
}
