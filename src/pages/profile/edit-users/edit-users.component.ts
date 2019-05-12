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
import { LISTA_TRANSMISION, COLOR, PLACA, CILINDRAJE, COMBUSTIBLE } from './vehicle.constant';
import { START_DATE_BF, END_DATE_BF, START_DATE } from '../../../commons/constants/dates-promos.contants';
import { TIPO_VENDEDOR, HABITACIONES, BATHROOMS, SOCIALCLASS, ANTIGUEDAD } from './immovable.constant';


@Component({
  selector: 'edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditUsersComponent implements OnInit, OnChanges, AfterViewInit  {
  public editProfileForm: FormGroup;
  public location: Object = {};
  public country: Object = {};
  public state: Object = {};
  public city: Object = {};

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
  ) {

  }

  ngOnInit() {
    this.setForm();
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(): void {
  }

  setForm() {
    this.editProfileForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      'id-number': ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      cellphone: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.city['id'] && !this.editProfileForm.invalid) {
      this.editUser();
      this.utilsService.goToTopWindow(20, 600);
    }
  }

  editUser(): void {}

}
