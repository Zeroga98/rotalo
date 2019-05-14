import { EventEmitter,
  Output,
  Input,
  OnChanges,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChildren,
  QueryList } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl, FormBuilder } from '@angular/forms';
import { PhotosService } from '../../../services/photos.service';
import { CategoriesService } from '../../../services/categories.service';
import { Router } from '@angular/router';
import { UtilsService } from '../../../util/utils.service';
import { CurrentSessionService } from '../../../services/current-session.service';
import { UserService } from '../../../services/user.service';
import { CollectionSelectService } from '../../../services/collection-select.service';

function passwordMatcher(c: AbstractControl): {[key: string]: boolean} | null {
  const password = c.get('password');
  const confirmNewPassword = c.get('confirmNewPassword');
  if (password.pristine || confirmNewPassword.pristine) {
    return null;
  }

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
  idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ''));

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private utilsService: UtilsService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.setForm();
  }

  ngAfterViewInit(): void {
    this.getInfoUser();
    this.changeDetectorRef.markForCheck();
  }

  ngOnChanges(): void {}

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
      this.validPasswordLenght(
        this.editProfileForm.get('confirmNewPassword').value
      )
    ) {
      this.editUser();
      this.utilsService.goToTopWindow(20, 600);
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
        cellphone: user.cellphone
      });

      this.countryValue = user.city.state.country;
      this.stateValue = user.city.state;
      this.cityValue = user.city;
    }
  }

  editUser(): void {
    let currentUser;
    currentUser = Object.assign({}, this.editProfileForm.value, {
      'city-id': this.city['id']
    });
    delete currentUser['confirmNewPassword'];
    delete currentUser['is-admin-store'];
    currentUser = this.utilsService.removeEmptyValues(currentUser);
    this.userService
      .updateUser(currentUser)
      .then(response => {

      })
      .catch(httpErrorResponse => {
        console.log(httpErrorResponse);
      });
  }
}
