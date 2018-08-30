import { DATAPICKER_CONFIG } from './../../commons/constants/datapicker.config';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import { EventEmitter, Output, Input, OnChanges, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl, FormBuilder } from '@angular/forms';
import { CategoryInterface } from '../../commons/interfaces/category.interface';
import { SubcategoryInterface } from '../../commons/interfaces/subcategory.interface';
import { PhotosService } from '../../services/photos.service';
import { CategoriesService } from '../../services/categories.service';
import { IMAGE_LOAD_STYLES } from './image-load.constant';
import * as moment from 'moment';
import { IMyDpOptions } from 'mydatepicker';
import { Router } from '@angular/router';
import { UtilsService } from '../../util/utils.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { ImageUploadComponent } from 'angular2-image-upload';

function validatePrice(c: AbstractControl): {[key: string]: boolean} | null {
  const price = c.get('price').value;
  const sellType = c.get('sell-type').value;
  if ((sellType === 'VENTA' && price > 0) || (sellType === 'SUBASTA' && price > 0) || (sellType === 'GRATIS' && price === 0)) {
      return null;
  }
  if (price > 0) {
    return null;
  }
  return { 'price': true };
}

@Component({
  selector: 'form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormProductComponent implements OnInit, OnChanges {
  @Input() product: ProductInterface;
  @Output() publish: EventEmitter<any> = new EventEmitter();
  @ViewChild('categorySelect', { read: ElementRef }) categorySelectElem: ElementRef;
  @ViewChild('imageInput') imageInput: ImageUploadComponent;
  photosForm: FormGroup;
  photosUploaded: Array<any> = [];
  categories: Array<CategoryInterface> = [];
  subCategories: Array<SubcategoryInterface> = [];
  subCategory: SubcategoryInterface;
  modelsVehicle: Array<any> = [];
  vehicleProperties: Array<any> = ['Particular', 'Público'];
  currentSubcategory: String = '';
  customStyleImageLoader = IMAGE_LOAD_STYLES;
  isModalShowed: boolean = false;
  disabledField = false;
  disabledFieldType = false;
  datePickerOptions: IMyDpOptions = DATAPICKER_CONFIG;
  minDate: string;
  maxDate: string;
  errorUploadImg = false;
  errorMaxImg = false;
  countryId;
  readonly maxNumberPhotos: number = 6;
  maxNumberImg = this.maxNumberPhotos;
  photosCounter = 0;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private currentSessionSevice: CurrentSessionService,
    private photosService: PhotosService,
    private categoryService: CategoriesService,
    private changeDetectorRef: ChangeDetectorRef,
    private utilsService: UtilsService
  ) {
    this.defineSubastaTimes();
    this.changeDetectorRef.markForCheck();
  }

  async ngOnInit() {
    const currentUser = this.currentSessionSevice.currentUser();
    this.countryId = Number(currentUser['countryId']);
    try {
      this.setInitialForm(this.getInitialConfig());
      this.categories = await this.categoryService.getCategories();
      this.loadYearsModelVehicle();
      this.changeDetectorRef.markForCheck();
    } catch (error) {}
  }

  ngOnChanges(): void {
    if (this.product) {
      this.setInitialForm(this.getInitialConfig());
      const interval = setInterval(() => {
        if (this.categories.length > 0) {
          if (this.product.photos) {
            this.saveInitialPhotos(this.product.photos);
          }
          this.setCategoryDefault(this.product.subcategory);
          clearInterval(interval);
        }
      }, 30);
    }
    this.changeDetectorRef.markForCheck();
  }

  get isColombia(){
    return this.countryId === 1;
  }

  changeKindOfProduct(evt) {
    this.photosForm.controls['negotiable'].enable();
    if (evt === 'GRATIS') {
      this.photosForm.patchValue({price: 0});
      this.photosForm.patchValue({'negotiable': false});
      const elem = document.getElementById('checkTerms') as any;
      elem.checked = false;
      this.disabledField = true;
      this.photosForm.controls['negotiable'].disable();
    }else if (evt === 'SUBASTA') {
      const elem = document.getElementById('checkTerms') as any;
      elem.checked = true;
      this.disabledField = false;
      this.photosForm.controls['negotiable'].disable();
    }else {
      this.disabledField = false;
    }
  }

  async publishPhoto(form) {
    if (!this.formIsInValid) {
      const photosIds = { 'photo-ids': this.getPhotosIds() };
      let dateMoment: any;

      if (this.photosForm.value['publish-until'].formatted) {
        dateMoment = moment(this.photosForm.value['publish-until'].formatted, 'YYYY-MM-DD');
        dateMoment = dateMoment.toDate();
      } else {
        this.photosForm.value['publish-until'].date.month = this.photosForm.value['publish-until'].date.month - 1;
        dateMoment = moment(this.photosForm.value['publish-until'].date).format('YYYY-MM-DD');
      }
      let dataAdditional;
      if (this.photosForm.get('sell-type').value === 'SUBASTA') {
        dataAdditional = {
          'publish-until': dateMoment,
          'negotiable': true
        };
      } else {
        if (this.product) {
          if (this.photosForm.get('sell-type').value === 'GRATIS') {
            dataAdditional = {
            //  'publish-until': dateMoment,
              'negotiable': false
            };
          }
          /* else {
            dataAdditional = {
              'publish-until': dateMoment
            };
          }*/
        } else {
          if (this.photosForm.get('sell-type').value === 'GRATIS') {
            dataAdditional = {
              'publish-until': this.getPublishUntilDate(),
              'negotiable': false
            };
          } else {
            dataAdditional = {
              'publish-until': this.getPublishUntilDate()
            };
          }
        }
      }
      let params;
      if (this.product) {
        params = Object.assign({}, this.photosForm.value, photosIds, dataAdditional);
        if (this.photosForm.get('sell-type').value !== 'SUBASTA') {
          delete params['publish-until'];
        }
      } else {
        const publishDate = {
          'published-at': new Date()
        };
        params = Object.assign({}, this.photosForm.value, photosIds, publishDate, dataAdditional);
      }
      this.photosUploaded.length = 0;
      delete params['category'];
      this.publish.emit(params);

    } else {
      this.validateAllFormFields(this.photosForm);
      if (this.photosUploaded.length <= 0) {
        this.errorMaxImg = true;
        this.changeDetectorRef.markForCheck();
      }
    }
  }

  validateIfErrorPrice() {
    if (this.photosForm && this.photosForm.errors && this.photosForm.errors.price) {
      return true;
    }
    return false;
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

  onUploadImageFinished(event) {
    this.errorUploadImg = false;
    this.errorMaxImg = false;
    this.photosCounter++;
    this.photosService.updatePhoto(event.file).subscribe(
      (response) => {
        const photo = Object.assign({}, response, { file: event.file });
        this.photosUploaded.push(photo);
        this.changeDetectorRef.markForCheck();
      },
      (error) => {
        this.errorUploadImg = true;
        console.error('Error: ', error);
        this.changeDetectorRef.markForCheck();
      },
      () => {
        if (this.photosCounter > 0) {
          this.photosCounter--;
        }
      }
    );
  }

  onRemovePreviewImage(photo) {
    const photoFile = this.findPhotoWithId(photo.file);
    if (photoFile) {
      this.imageInput.deleteFile(photoFile);
    }
    if (photo && photo.id) {
      this.removeImageFromServer(photo.id);
    }
    this.changeDetectorRef.markForCheck();
  }

 private findPhotoWithId(file) {
   return this.imageInput.files.find(inputFile => {
    return inputFile.file == file;
    });
  }

  async onRemoveImage(file) {
    const photo = this.findPhoto(file);
    if (photo) {this.removeImageFromServer(photo.id); }
    this.errorUploadImg = false;
    this.changeDetectorRef.markForCheck();
  }

  async removeImageFromServer(id: number) {
    try {
      const response = await this.photosService.deletePhotoById(id);
      this.removePhoto(id);
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      console.error('error: ', error);
    }
  }

  setValidationVehicle() {
    const typeVehicleControl = this.photosForm.get('type-vehicle');
    const model = this.photosForm.get('model');
    typeVehicleControl.clearValidators();
    model.clearValidators();
    if (this.subcategoryIsVehicle()) {
      typeVehicleControl.setValidators([Validators.required]);
      model.setValidators([Validators.required]);
    }
    typeVehicleControl.updateValueAndValidity();
    model.updateValueAndValidity();
  }

  closeModal() {
    this.isModalShowed = false;
  }

  openModal() {
    this.isModalShowed = true;
  }

  subcategoryIsVehicle(): boolean {
    const subcategoryValue = this.photosForm.get('subcategory-id').value;
    if (subcategoryValue) {
      const subcategory = this.findSubCategory(subcategoryValue);
      if (subcategory && subcategory.name === 'Carros') {
        return true;
      }
    }
    return false;
  }

  selectedComunity(idCategory: number) {
    this.subCategories = this.findCategory(idCategory).subcategories;
    this.currentSubcategory = '';
    this.subCategory = null;
  }

  selectedSubcategory(idSubcategory) {
    this.subCategory = this.findSubCategory(idSubcategory);
  }

  loadYearsModelVehicle() {
    const years = (new Date()).getFullYear() - 1968;
    for (let i = 0; i < years; i++) {
      this.modelsVehicle.push((new Date()).getFullYear() + 1 - i);
    }
  }

  private setInitialForm(config: ProductInterface) {
    let typeVehicle = '';
    let model = '';

    if (config['type-vehicle'] && config['model']) {
      typeVehicle = config['type-vehicle'];
      model = config['model'];
    }

    if (config['sell-type'] === 'GRATIS') {
      this.disabledField = true;
      this.photosForm.controls['negotiable'].disable();
    }

    if (config['sell-type'] === 'SUBASTA') {
      this.disabledField = true;
      this.disabledFieldType = true;
      this.photosForm.controls['negotiable'].disable();
    }

        this.photosForm =  this.fb.group({
        name: [config.name, [Validators.required]],
        price: [config.price, [Validators.required]],
        currency: [config.currency, [Validators.required]],
        'subcategory-id': [config['subcategory-id'], [Validators.required]],
        used: [config.used, [Validators.required]],
        visible: [config.visible, [Validators.required]],
        'sell-type': [config['sell-type'], [Validators.required]],
        description: [config.description, [Validators.required]],
        negotiable: [{value: config.negotiable, disabled: false}, []],
        'publish-until': [config['publish-until'], []],
        'type-vehicle': [typeVehicle, []],
        'model': [model, []],
        category: [config['category'], [Validators.required]],
        }, {validator: validatePrice});
  }

  private getInitialConfig(): ProductInterface {
    const date = new Date();
    date.setMonth(date.getMonth() + 2);
    let objectDate = {
      date: {
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate()
        }
    };

    if (this.product) {
      const publishUntil  = moment(this.product['publish-until']).toDate();
      objectDate = {
        date: {
          year: publishUntil.getFullYear(),
          month: publishUntil.getMonth() + 1,
          day: publishUntil.getDate()
          }
      };
      this.product['publish-until'] = objectDate;
    }

    const product: ProductInterface = {
      name: null,
      price: null,
      currency: 'COP',
      'subcategory-id': '',
      used: '',
      visible: '',
      'sell-type': '',
      description: null,
      'publish-until': objectDate,
      negotiable: true,
      category: ''
    };
    return Object.assign({}, product, this.product) as ProductInterface;
  }

  private getPhotosIds(): Array<string> {
    return this.photosUploaded.map(photo => {
      return photo.id.toString(); });
  }

  private setCategoryDefault(subCategory: SubcategoryInterface) {
    const options = this.categorySelectElem.nativeElement.options;
    const length = options.length;
    for (let index = 0; index < length; index++) {
      options[index].selected = options[index].value == subCategory.category.id;
      if (options[index].value == subCategory.category.id) {
        this.selectedComunity(subCategory.category.id as number);
        this.photosForm.controls['category'].setValue(subCategory.category.id);
        this.photosForm.controls['subcategory-id'].setValue(subCategory.id);
      }
    }
  }

  private findCategory(id: number) {
    return this.categories.find(
      (category: CategoryInterface) => category.id === id
    );
  }

  private findSubCategory(id: number) {
    return this.subCategories.find(subCategory => subCategory.id === id);
  }

  private getPublishUntilDate(): Date {
    /** El 30 debe ser congifurable DEUDA TECNICA */
    var date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  }

  private cleanArrayPhotos() {
    this.photosUploaded = this.photosUploaded.map(photo => {
      return { id: photo.id, url: photo.url };
    });
  }

  private findPhoto(file: File) {
    return this.photosUploaded.find(photo => {
      return photo.file == file;
    });
  }

  private saveInitialPhotos(photos) {
    this.photosUploaded = [].concat(photos);
    if (this.maxNumberImg > 0 && this.maxNumberImg <= this.maxNumberPhotos) {
      this.maxNumberImg = this.maxNumberImg - this.photosUploaded.length;
    }
  }

  private removePhoto(id: number) {
    this.photosUploaded = this.photosUploaded.filter(photo => photo.id != id);
    if (this.maxNumberImg >= 0 && this.maxNumberImg <= this.maxNumberPhotos) {
      this.maxNumberImg = this.maxNumberPhotos - (this.photosUploaded.length - this.imageInput.files.length ) ;
    }
  }

  private defineSubastaTimes(){
    this.minDate = moment().format('YYYY-MM-DD');
    this.maxDate = moment().add(30, 'days').format('YYYY-MM-DD');
  }

  get formIsInValid() {
    return this.photosForm.invalid || this.photosUploaded.length <= 0 ;
  }
}
