import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,  Validators } from '@angular/forms';

@Component({
    selector: 'signup-page',
    templateUrl: 'signup.page.html',
    styleUrls: ['signup.page.scss']
})
export class SignUpPage implements OnInit {
    public modalTermsIsOpen: boolean = false;
    public registerForm: FormGroup;
    public selectIsCompleted: boolean = false;
    public location: Object = {};

    ngOnInit(): void {
        this.registerForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            idNumber: new FormControl('', [Validators.required]),
            email: new FormControl('', [ Validators.required, Validators.email]),
            cellphone: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            passwordConfirmation: new FormControl('', [Validators.required, Validators.minLength(6), this.validatePasswordConfirm.bind(this)]),
            termsCheckbox: new FormControl('', [this.checkBoxRequired.bind(this)])
        });
    }

    onSubmit() {
        alert("Submit");
    }

    selectOption(ev) {
        this.selectIsCompleted = ev.completed;
        this.location = ev.location;
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
        return this.registerForm.invalid || !this.selectIsCompleted;
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
