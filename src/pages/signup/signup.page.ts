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
        private utilsService: UtilsService){}
    
    ngOnInit(): void {
        this.registerForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            'id-number': new FormControl('', [Validators.required]),
            email: new FormControl('', [ Validators.required, Validators.email]),
            cellphone: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            'password-confirmation': new FormControl('', [Validators.required, Validators.minLength(6), this.validatePasswordConfirm.bind(this)]),
            termsCheckbox: new FormControl('', [this.checkBoxRequired.bind(this)])
        });
    }

    async onSubmit() {
        try {
            const params:UserRequestInterface = this.buildParamsUserRequest();
            const response = await this.userService.saveUser(params);
            this.errorsSubmit = [];
        } catch (error) {
            this.errorsSubmit = error.error.errors;
            this.utilsService.goToTopWindow(20, 600);
        }
    }

    buildParamsUserRequest():UserRequestInterface{
        let params = Object.assign({}, this.registerForm.value, {'city-id':this.city.id});
        delete params.termsCheckbox
        return params;
    }

    selectedCountry(ev) {
        this.country = ev;
    }

    selectedStates(ev) {
        this.state = ev;
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

    private selectIsCompleted():boolean{
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
