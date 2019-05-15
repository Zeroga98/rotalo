import {
  EventEmitter,
  Output,
  Input,
  OnChanges,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChildren,
  QueryList
} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl, FormBuilder } from '@angular/forms';
import { PhotosService } from '../../../services/photos.service';
import { CategoriesService } from '../../../services/categories.service';
import { Router } from '@angular/router';
import { UtilsService } from '../../../util/utils.service';
import { CurrentSessionService } from '../../../services/current-session.service';
import { UserService } from '../../../services/user.service';
import { CollectionSelectService } from '../../../services/collection-select.service';
import { SettingsService } from '../../../services/settings.service';

function passwordMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const password = c.get('password');
  const confirmNewPassword = c.get('confirmNewPassword');
  if (password.value === confirmNewPassword.value) {
    return null;
  }
  return { 'match': true };
}


@Component({
  selector: 'edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss']
})
export class EditUsersComponent implements OnInit, OnChanges, AfterViewInit {
  public editProfileForm: FormGroup;
  public selectIsCompleted = false;
  public location: Object = {};
  public country: Object = {};
  public state: Object = {};
  public city: Object = {};
  public countryValue = {};
  public stateValue;
  public cityValue;
  public countryId;
  public user;
  public errorState = false;
  public errorCity = false;
  public errorChange: String;
  public messageChange: String;
  idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ''));
  public companies = [];
  constructor(
    private settingsService: SettingsService,
    private router: Router,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private utilsService: UtilsService,
    private userService: UserService,
    private currentSessionSevice: CurrentSessionService,
  ) { }

  ngOnInit() {
    this.setForm();
  }

  ngAfterViewInit(): void {
    this.getInfoUser();
    window.scroll(0, 0);
    document.body.scrollTop = 0;
    this.changeDetectorRef.markForCheck();
  }

  ngOnChanges(): void { }

  setForm() {
    this.editProfileForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.maxLength(50)]],
        'id-number': ['', Validators.required],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
            )
          ]
        ],
        'content-admin': ['', [Validators.required]],
        'is-admin-store': ['', [Validators.required]],
        cellphone: ['', [Validators.required]],
        'company-id': ['', [Validators.required]],
        confirmNewPassword: [''],
        password: ['']
      },
      { validator: passwordMatcher }
    );
  }

  onSubmit() {
    if (
      this.city['id'] &&
      !this.editProfileForm.invalid &&
      this.validPasswordLenght(this.editProfileForm.get('password').value) &&
      this.validPasswordLenght(this.editProfileForm.get('confirmNewPassword').value)
    ) {
      this.messageChange = '';
      this.errorChange = '';
      this.editUser();
      this.utilsService.goToTopWindow(20, 600);
    } else {
      this.validateAllFormFields(this.editProfileForm);
      if (!this.state['id']) {
        this.errorState = true;
      }
      if (!this.city['id']) {
        this.errorCity = true;
      }
    }
  }

  validateState() {
    if (this.state['id']) {
      this.errorState = false;
    }
  }

  validateCity() {
    if (this.city['id']) {
      this.errorCity = false;
    }
  }


  validPasswordLenght(password) {
    if (!password || password.length >= 6) {
      return true;
    }
    return false;
  }

  getInfoUser() {
    this.userService
      .getInfomationUser(this.idProduct)
      .then(response => {
        this.user = response;
        this.onInfoRetrieved(response);
      })
      .catch(httpErrorResponse => {
        console.log(httpErrorResponse);
      });
  }

  onInfoRetrieved(user): void {
    if (this.editProfileForm) {
      this.editProfileForm.reset();
    }
    if (user) {
      this.editProfileForm.patchValue({
        name: user.name,
        'id-number': user['id-number'],
        email: user.email.toLowerCase(),
        'content-admin': user['content-admin'] ? true : false,
        'is-admin-store': user['is-admin-store'] ? true : false,
        'company-id': user.company.id,
        cellphone: user.cellphone
      });

      this.countryValue = user.city.state.country;
      this.stateValue = user.city.state;
      this.cityValue = user.city;
      if (user.city.state.country) {
        this.getCommpanyList(user.city.state.country.id);
      }
    }
  }

  getCommpanyList(idCountry) {
    const params = {
      idPais: idCountry
    };
    this.settingsService.getCommpanyList(params).subscribe((response) => {

      if (response && response.body.empresas) {
        this.companies = response.body.empresas;
      }
    }, (error) => {
      console.log(error);
    });
  }

  editUser(): void {
    let currentUser;
    const stores = [];
    if (this.editProfileForm.get('is-admin-store').value) {
      const container = document.getElementById('shop-wrap');
      const inputs = container.getElementsByTagName('input');
      for (let i = 0; i < inputs.length; ++i) {
        if (inputs[i].checked == true) {
          stores.push(inputs[i].id);
        }
      }
    }

    currentUser = Object.assign({}, this.editProfileForm.value, {
      'city-id': this.city['id'],
      'stores-ids': stores,
      'user-id-to-update': this.user.id
    });
    delete currentUser['confirmNewPassword'];
    delete currentUser['is-admin-store'];
    currentUser = this.utilsService.removeEmptyValues(currentUser);
    this.userService
      .updateUser(currentUser)
      .then(response => {
        this.messageChange = 'Información del usuario actualizada.';
        this.errorChange = '';
      })
      .catch(httpErrorResponse => {
        this.messageChange = '';
        if (httpErrorResponse.status === 403) {
        }
        if (httpErrorResponse.status === 422) {
          this.errorChange = httpErrorResponse.error.errors[0].title;
        }
        if (httpErrorResponse.status === 0) {
          this.errorChange =
            '¡No hemos podido conectarnos! Por favor intenta de nuevo.';
        }
        if (httpErrorResponse.status === 500) {
          this.errorChange = httpErrorResponse.error.message;
        }
      });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  changeCountry(country) {
    this.getCommpanyList(country.id);
    this.editProfileForm.patchValue({
      'company-id': ''
    });
  }

  goBack(): void {
    window.history.back();
  }

  setValidationId() {
    if (this.country) {
      const idCountry  = this.country['name'];
      this.editProfileForm.get('cellphone').clearValidators();
      if (idCountry == 'Guatemala') {
        this.editProfileForm.get('cellphone').setValidators([Validators.required,
          Validators.pattern(/^\d{8}$/)
        ]);
      } else  {
        this.editProfileForm.get('cellphone').setValidators([Validators.required]);
      }

      this.editProfileForm.get('cellphone').updateValueAndValidity();

    }
  }

  setValidationDocument() {
    if (this.country) {
      const idCountry  = this.country['name'];
      this.editProfileForm.get('id-number').clearValidators();
      if (idCountry == 'Guatemala') {
        this.editProfileForm.get('id-number').setValidators([
          Validators.pattern('^[0-9]{13}$'),
           Validators.required
         ]);
      } else  {
        this.editProfileForm.get('id-number').setValidators([Validators.required]);
      }

      this.editProfileForm.get('id-number').updateValueAndValidity();

    }
  }

}
