import { DATAPICKER_CONFIG } from '../../../commons/constants/datapicker.config';
import { ProductInterface } from '../../../commons/interfaces/product.interface';
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
import { CategoryInterface } from '../../../commons/interfaces/category.interface';
import { SubcategoryInterface } from '../../../commons/interfaces/subcategory.interface';
import { PhotosService } from '../../../services/photos.service';
import { CategoriesService } from '../../../services/categories.service';
import { IMAGE_LOAD_STYLES } from './image-load.constant';
import * as moment from 'moment';
import { IMyDpOptions } from 'mydatepicker';
import { Router } from '@angular/router';
import { UtilsService } from '../../../util/utils.service';
import { CurrentSessionService } from '../../../services/current-session.service';
import { ImageUploadComponent } from 'angular2-image-upload';
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

export class EditUsersComponent implements OnInit, OnChanges, AfterViewInit  {
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

  idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ""));

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private currentSessionSevice: CurrentSessionService,
    private photosService: PhotosService,
    private categoryService: CategoriesService,
    private changeDetectorRef: ChangeDetectorRef,
    private utilsService: UtilsService,
    private userService: UserService,
    private collectionService: CollectionSelectService,
  ) {}

  ngOnInit() {
  //  this.utilsService.goToTopWindow(20, 600);
    this.setForm();
  }

  ngAfterViewInit(): void {
    this.getInfoUser();
    this.changeDetectorRef.markForCheck();
  }

  ngOnChanges(): void {
  }

  setForm() {
    this.editProfileForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      'id-number': ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      'content-admin': ['', [Validators.required]],
      cellphone: ['', [Validators.required]],
      confirmNewPassword: [''],
      password: [''],
  //    confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]],
   //   password: ['', [Validators.required, Validators.minLength(6)]],
    }, {validator: passwordMatcher});
  }

  onSubmit() {
    if (this.city['id'] && !this.editProfileForm.invalid) {
      this.editUser();
      this.utilsService.goToTopWindow(20, 600);
    }
  }

  getInfoUser() {
    this.userService.getInfomationUser(this.idProduct).then((response) => {
      this.onInfoRetrieved(response);
    }) .catch(httpErrorResponse => {
      console.log(httpErrorResponse);
    });
  }

  editUser(): void {}


  onInfoRetrieved(user): void {
    if (this.editProfileForm) {
      this.editProfileForm.reset();
    }
    if (user) {
      this.editProfileForm.patchValue({
        name: user.name,
        'id-number': user['id-number'],
        email: user.email.toLowerCase(),
        'content-admin': user['content-admin'],
        cellphone: user.cellphone
      });

      this.countryValue = user.city.state.country;
      this.stateValue = user.city.state;
      this.cityValue = user.city;
    }

  }






}
