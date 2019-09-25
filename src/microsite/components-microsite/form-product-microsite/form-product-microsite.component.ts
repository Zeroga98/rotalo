import { DATAPICKER_CONFIG } from '../../../commons/constants/datapicker.config';
import { ProductInterface } from '../../../commons/interfaces/product.interface';
import { EventEmitter, Output, Input, OnChanges, ViewChild, ElementRef, ChangeDetectionStrategy, AfterViewInit, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl, FormBuilder, FormArray } from '@angular/forms';
import { CategoryInterface } from '../../../commons/interfaces/category.interface';
import { SubcategoryInterface } from '../../../commons/interfaces/subcategory.interface';
import { PhotosService } from '../../../services/photos.service';
import { CategoriesService } from '../../../services/categories.service';
import { IMAGE_LOAD_STYLES } from './image-load.constant';
import * as moment from 'moment';
import { IMyDpOptions } from 'mydatepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../util/utils.service';
import { CurrentSessionService } from '../../../services/current-session.service';
import { ImageUploadComponent } from 'angular2-image-upload';
import { UserService } from '../../../services/user.service';
import { CollectionSelectService } from '../../../services/collection-select.service';
import { LISTA_TRANSMISION, COLOR, PLACA, CILINDRAJE, COMBUSTIBLE } from './vehicle.constant';
import { START_DATE_BF, END_DATE_BF, START_DATE } from '../../../commons/constants/dates-promos.contants';
import { TIPO_VENDEDOR, HABITACIONES, BATHROOMS, SOCIALCLASS, ANTIGUEDAD } from './immovable.constant';
import { COLOR_FASHION } from './colors-clothes.constant';

function validatePrice(c: AbstractControl): {[key: string]: boolean} | null {
  const price = c.get('price').value;
  const sellType = c.get('sellType').value;
  if ((sellType === 'VENTA' && price > 0) || (sellType === 'SUBASTA' && price > 0) || (sellType === 'GRATIS' && price === 0)) {
      return null;
  }
  if (price > 0) {
    return null;
  }
  return { 'price': true };
}

function isCategorySelected( c: AbstractControl ): { [key: string]: boolean } | null {
  if (this.categorySelected) {
    return null;
  }
  return { isCategory: true };
}

@Component({
  selector: 'form-product-microsite',
  templateUrl: './form-product-microsite.component.html',
  styleUrls: ['./form-product-microsite.component.scss']
})
export class FormProductMicrositeComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() product: ProductInterface;
  @Output() publish: EventEmitter<any> = new EventEmitter();
  @ViewChild('categorySelect', { read: ElementRef }) categorySelectElem: ElementRef;
  @ViewChild('imageInput') imageInput: ImageUploadComponent;
  photosForm: FormGroup;
  photosUploaded: Array<any> = [];
  categories: Array<CategoryInterface> = [];
  subCategories: Array<any> = [];
  genders: Array<any> = [];
  vehiclesType: Array<any> = [];
  subCategory;
  yearsVehicle: Array<any> = [];
  transmissionList: Array<any> = LISTA_TRANSMISION;
  colorList: Array<any> = COLOR;
  colorListFashion: Array<any> = COLOR_FASHION;
  vehicleNumberList: Array<any> = PLACA;
  cylinderList: Array<any> = CILINDRAJE;
  combustibleList: Array<any> = COMBUSTIBLE;
  carMakeList: Array<any> = COMBUSTIBLE;
  vehicleProperties: Array<any> = ['Particular', 'Público'];
  modelList: Array<any> = [];
  brandsList: Array<any> = [];
  linesList: Array<any> = [];
  sizesList: Array<any> = [];
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
  public country: Object = {};
  public state: Object = {};
  public city: Object = {};
  public userEdit: any;
  public countryValue = {};
  public stateValue;
  public cityValue;
  public errorState = false;
  public errorCity = false;
  public communityName = '';
  public startDateBf = START_DATE_BF;
  public startDate = START_DATE;
  public endDate = END_DATE_BF;
  public courrentDate = new Date();
  public categorySelected;
  public maxValueNewPrice = 0;
  public numberOfPhotos = [1, 2, 3, 4, 5, 6];
  public modalTermsIsOpen: boolean = false;
  @ViewChild('grid') grid: ElementRef;
  @ViewChildren('photosEnd') endForRender: QueryList<any>;
  items = [1, 2, 3, 4, 5];
  typeSellers: Array<any> = TIPO_VENDEDOR;
  rooms : Array<any> = HABITACIONES;
  bathrooms : Array<any> = BATHROOMS;
  antiguedades: Array<any> = ANTIGUEDAD;
  socialClasses: Array<any> = SOCIALCLASS;
  cellphone: String;
  public formFashion;
  @Input() errorference;
  @Input() photosUploadedRest;
  public idShop ;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private currentSessionSevice: CurrentSessionService,
    private photosService: PhotosService,
    private categoryService: CategoriesService,
    private changeDetectorRef: ChangeDetectorRef,
    private utilsService: UtilsService,
    private userService: UserService,
    private collectionService: CollectionSelectService,
    ) {
      this.getCountries();
      this.defineSubastaTimes();
      this.route.params.subscribe(params => {
        this.idShop = params['idShop'];
      });
      this.changeDetectorRef.markForCheck();
    }

    async ngOnInit() {

      const currentUser = this.currentSessionSevice.currentUser();
      this.countryId = Number(currentUser['countryId']);
      try {
        this.setInitialForm(this.getInitialConfig());
        this.categoryService.getCategoriesActiveServer().subscribe((response) => {
          this.loadYearsModelVehicle();
          this.categories = response;
          this.changeDetectorRef.markForCheck();
        }, (error) => {
          console.log(error);
        });
        this.changeDetectorRef.markForCheck();
      } catch (error) {
        console.log(error);
      }
    }

    ngAfterViewInit(): void {
      this.changeDetectorRef.markForCheck();
    }

    ngOnChanges(value): void {
      if (this.product) {
        this.setInitialForm(this.getInitialConfig());
        this.getCountries();
        const interval = setInterval(() => {
          if (this.categories.length > 0) {
            if (this.product['photoList']) {
              this.saveInitialPhotos(this.product['photoList']);
            }
            this.setCategoryDefault(this.product.subcategory);
            clearInterval(interval);
          }
        }, 30);
      }

      if (value && value.errorference && document.getElementById('fashion')) {
        const element = document.getElementById('fashion');
        element.scrollIntoView({ block: 'end', behavior: 'smooth' });
      }

      if (value && value.errorference && document.getElementById('reference-product')) {
        const element = document.getElementById('reference-product');
        element.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }

      if (value && value.photosUploadedRest == 0) {
        this.photosUploaded.length = 0;
      }

      this.changeDetectorRef.markForCheck();
    }


  async getInfoUser() {
    this.userEdit = await this.userService.getInfoUser();
    this.cellphone = this.userEdit.cellphone;
    if (this.userEdit && this.userEdit.company && this.userEdit.company.community) {
      this.communityName = this.userEdit.company.community.name;
    }
    this.onInfoRetrieved(this.userEdit);
/** **/

    if (this.userEdit && !this.userEdit['is-admin-store'] && this.photosForm) {
      const referenceForm = this.photosForm.get('reference');
      referenceForm.clearValidators();
      referenceForm.updateValueAndValidity();
    }
    this.changeDetectorRef.markForCheck();
  }

  onInfoRetrieved(user): void {
    if (user) {
      this.country = user.city.state.country;
      this.stateValue =  user.city.state;
      this.cityValue = user.city;
    }
    if (this.product &&  this.country) {
      this.product.city.state.country =  this.country;
      this.stateValue =  this.product.city.state;
      this.cityValue = this.product.city;
    }
    this.changeDetectorRef.markForCheck();
  }

  async getCountries() {
    try {
      await this.collectionService.isReady();
      this.getInfoUser();
    } catch (error) {
      console.error(error);
    }
  }

  get isColombia() {
    return this.countryId == 1;
  }

  get isGuatemala() {
    return this.countryId == 9;
  }

  getSizes(params) {
    this.collectionService.getSizes(params).subscribe((response) => {
      if (response.body) {
        this.sizesList = response.body.tallas;
        this.changeDetectorRef.markForCheck();
      }
    }, (error) => {
      console.log(error);
    });
  }

  changeKindOfProduct(evt) {
    this.photosForm.controls['negotiable'].enable();
    this.photosForm.patchValue({stock: 1});
    this.photosForm.patchValue({checkNewPrice: false});
    this.removeValidatorNewPrice();
    if (evt === 'GRATIS') {
      this.photosForm.patchValue({price: 0});
      this.photosForm.patchValue({'negotiable': false});
      const elem = document.getElementById('checkTerms') as any;
      elem.checked = false;
      this.disabledField = true;
      this.photosForm.controls['negotiable'].disable();
    } else if (evt === 'SUBASTA') {
      const elem = document.getElementById('checkTerms') as any;
      elem.checked = true;
      this.disabledField = false;
      this.photosForm.controls['negotiable'].disable();
    } else {
      this.disabledField = false;
    }
  }

  async publishPhoto(form) {

    this.setValidationVehicle();
    this.setValidationImmovable();
    this.setFashionValidation();

    if ((!this.formIsInValid && (this.city['id'])  &&  this.photosUploaded.length > 0)
    && (this.showOptionsFashion || !this.showOptionsFashion && this.formFashion && !this.formFashion.invalid)) {
      const photosIds = { 'photoIds': this.loadOrderPhotos() };
      let dateMoment: any;

      if (this.photosForm.value['publishUntil'].formatted) {
        dateMoment = moment(this.photosForm.value['publishUntil'].formatted, 'YYYY-MM-DD');
        dateMoment = dateMoment.toDate();
      } else {
        this.photosForm.value['publishUntil'].date.month = this.photosForm.value['publishUntil'].date.month - 1;
        dateMoment = moment(this.photosForm.value['publishUntil'].date).format('YYYY-MM-DD');
      }
      let dataAdditional;
      if (this.photosForm.get('sellType').value === 'SUBASTA') {
        dataAdditional = {
          'publishUntil': dateMoment,
          'negotiable': true
        };
      } else {
        if (this.product) {
          if (this.photosForm.get('sellType').value === 'GRATIS') {
            dataAdditional = {
              'negotiable': false
            };
          }
        } else {
          if (this.photosForm.get('sellType').value === 'GRATIS') {
            dataAdditional = {
              'publishUntil': this.getPublishUntilDate(),
              'negotiable': false
            };
          } else {
            dataAdditional = {
              'publishUntil': this.getPublishUntilDate()
            };
          }
        }
      }
      let params;
      if (this.product) {
        params = Object.assign({}, this.photosForm.value, photosIds, dataAdditional, {
          'cityId': this.city['id']
        });
        if (this.photosForm.get('sellType').value !== 'SUBASTA') {
          delete params['publishUntil'];
        }
      } else {
        const publishDate = {
          'publishedAt': new Date()
        };
        // const photosIds2 = [{ 'photoId': 12965, 'position': 1}];
        params = Object.assign({}, this.photosForm.value, photosIds, publishDate, dataAdditional, {
          'cityId': this.city['id']
        });

      }

    //  this.photosUploaded.length = 0;
      /**Mejora hacer nested formgroups**/
      delete params['lineId'];
      delete params['transmission'];
      delete params['color'];
      delete params['licensePlate'];
      delete params['mileage'];
      delete params['displacement'];
      delete params['gas'];
      delete params['carMake'];
      delete params['typeOfSeat'];
      delete params['airbag'];
      delete params['airConditioner'];
      delete params['absBrakes'];
      delete params['uniqueOwner'];

      delete params['antiquity'];
      delete params['squareMeters'];
      delete params['rooms'];
      delete params['bathrooms'];
      delete params['sellerType'];
      delete params['floor'];
      delete params['elevator'];
      delete params['guardHouse'];
      delete params['parking'];
      delete params['canonQuota'];
      delete params['fullyFurnished'];
      delete params['pool'];
      delete params['childishGames'];
      delete params['usefulRoom'];
      delete params['squareMetersTerrain'];
      delete params['socialClass'];


      if (!this.photosForm.get('checkNewPrice').value) {
        delete params['specialPrice'];
      }
      delete params['checkNewPrice'];
      if (this.subcategoryIsVehicle() || this.subcategoryIsMotos()) {
          const vehicle  = {
            'vehicleType': this.subcategoryIsVehicle() ? 'AUTO' : 'MOTO',
            'lineId': this.photosForm.get('lineId').value,
            'transmission': this.photosForm.get('transmission').value,
            'color': this.photosForm.get('color').value,
            'licensePlate': this.photosForm.get('licensePlate').value,
            'mileage': this.photosForm.get('mileage').value,
            'displacement': this.photosForm.get('displacement').value,
            'gas': this.photosForm.get('gas').value,
            'typeOfSeat': this.photosForm.get('typeOfSeat').value,
            'airbag': this.photosForm.get('airbag').value,
            'airConditioner': this.photosForm.get('airConditioner').value,
            'absBrakes': this.photosForm.get('absBrakes').value,
            'uniqueOwner': this.photosForm.get('uniqueOwner').value,
            'vehiclesTypeId': this.photosForm.get('vehiclesTypeId').value
          };
          params.vehicle = vehicle;
      }
      if (this.subcategoryIsHouse() || this.subcategoryIsFlat()) {
        const immovable  = {
          'immovableType': this.subcategoryIsHouse() ? 'Casa' : 'Apartamento',
          'antiquity': this.photosForm.get('antiquity').value,
          'squareMeters': this.photosForm.get('squareMeters').value,
          'rooms': this.photosForm.get('rooms').value,
          'bathrooms': this.photosForm.get('bathrooms').value,
          'sellerType': this.photosForm.get('sellerType').value,
          'floor': this.photosForm.get('floor').value,
          'elevator': this.photosForm.get('elevator').value,
          'guardHouse': this.photosForm.get('guardHouse').value,
          'parking': this.photosForm.get('parking').value,
          'canonQuota': this.photosForm.get('canonQuota').value,
          'fullyFurnished': this.photosForm.get('fullyFurnished').value,
          'pool': this.photosForm.get('pool').value,
          'childishGames': this.photosForm.get('childishGames').value,
          'usefulRoom': this.photosForm.get('usefulRoom').value,
          'squareMetersTerrain': this.photosForm.get('squareMetersTerrain').value,
          'socialClass': this.photosForm.get('socialClass').value
        };
        params.immovable = immovable ;

    }
      params.stock = this.photosForm.get('stock').value;
      params.storeId = this.idShop;
      if (!this.showOptionsFashion && this.formFashion && !this.formFashion.invalid) {
        params.children = this.formFashion.get('children').value;
        params.children.map((item) => {
          item.genderId = Number(this.photosForm.get('genderId').value);
          item.brand = this.photosForm.get('brandFashion').value;
          item.color = this.photosForm.get('colorFashion').value;
        });
        delete params['genderId'];
        delete params['brandFashion'];
        delete params['colorFashion'];
      }

      const request = {
        'data': {
          'attributes': params
        }
      };

      this.publish.emit(request);
    } else {
      this.validateAllFormFields(this.photosForm);
      if (!this.showOptionsFashion && this.formFashion && this.formFashion.invalid) {
        this.validateAllFormFieldsArray(this.formFashion);
      }
      if (this.photosUploaded.length <= 0) {
        this.errorMaxImg = true;
        this.changeDetectorRef.markForCheck();
      }
      if (!this.state['id']) {
        this.errorState = true;
      }
      if (!this.city['id']) {
        this.errorCity = true;
      }
      this.scrollToError();
    }
  }

  scrollToError() {
    /**El numero 3 puede cambiar en caso que se agreguen nuevos campos al formulario**/
    const elements = document.getElementsByClassName('ng-invalid');
    if (this.errorUploadImg || this.errorMaxImg) {
      const element = document.getElementById('image-upload');
      element.scrollIntoView({ block: 'end', behavior: 'smooth' });
    } else if (!this.product && elements && elements[5]) {
      elements[5].scrollIntoView({ block: 'start', behavior: 'smooth' });
    } else if (this.product && elements && elements[3]) {
      elements[3].scrollIntoView({ block: 'start', behavior: 'smooth' });
    } else if (this.errorState || this.errorCity) {
      const element = document.getElementById('select-cities');
      element.scrollIntoView({ block: 'start', behavior: 'smooth' });
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

  validateAllFormFieldsArray(formGroup: FormGroup) {
    Object.keys(formGroup.controls.children['controls']).forEach(field => {
      const control = formGroup.controls.children['controls'][field];
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  overFiles () {
    this.imageInput.onFileOver(true);
  }

  onDrop(event) {
    this.imageInput.onFileChange(event.dataTransfer.files);
    event.stopPropagation();
    event.preventDefault();
  }

  onDragOver(event) {
    this.imageInput.onFileOver(true);
    event.stopPropagation();
    event.preventDefault();
  }

  onUploadImageFinished(event) {
    this.errorUploadImg = false;
    this.errorMaxImg = false;
    if (event.file.type == 'image/jpeg'
     || event.file.type == 'image/png'
     || event.file.type == 'image/jpg'
     || event.file.type == 'image/webp') {
      if (event.file.size < 10000000) {
        this.photosCounter++;
        this.photosService.uploadPhoto(event.file).subscribe((response) => {
          const photo = Object.assign({}, response, { file: event.file });
          this.photosUploaded.push(photo);
          this.changeDetectorRef.markForCheck();
        }, (error) => {
          if (error.error && error.error.status) {
            if (error.error.status == '624') {
              this.errorUploadImg = true;
              this.imageInput.deleteFile(event.file);
            } else if (error.error.status == '625') {
              this.errorMaxImg = true;
              this.imageInput.deleteFile(event.file);
            } else  {
              this.errorUploadImg = true;
            }
          } else {
            this.errorUploadImg = true;
          }
          console.error('Error: ', error);
          this.changeDetectorRef.markForCheck();
        },
          () => {
            if (this.photosCounter > 0) {
              this.photosCounter--;
            }
          }
        );
      } else {
        this.errorMaxImg = true;
        this.imageInput.deleteFile(event.file);
      }
    } else {
      this.errorUploadImg = true;
      this.imageInput.deleteFile(event.file);
    }
  }

  onRemovePreviewImage(photo) {
    const photoFile = this.findPhotoWithId(photo.file);
    if (photoFile) {
      this.imageInput.deleteFile(photoFile);
    }
    if (photo && photo.photoId) {
      this.removeImageFromServer(photo.photoId);
    }
    this.changeDetectorRef.markForCheck();
  }

  onRemoveAll() {
    this.photosUploaded = [];
    this.maxNumberImg = 6;
    this.imageInput.deleteAll();
  }

  uploadFiles() {
    const element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
    element.click();
  }

 private findPhotoWithId(file) {
   return this.imageInput.files.find(inputFile => {
    return inputFile.file == file;
    });
  }

  async onRemoveImage(file) {
    const photo = this.findPhoto(file);
    if (photo) {this.removeImageFromServer(photo.photoId); }
    this.errorUploadImg = false;
    this.changeDetectorRef.markForCheck();
  }

  async removeImageFromServer(id: number) {
    try {
      const response = await this.photosService.deletePhoto(id);
      this.removePhoto(id);
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      console.error('error: ', error);
    }
  }

  resetFormsVehicle() {
    this.photosForm.patchValue({stock: 1});
    this.photosForm.patchValue({'lineId': ''});
    this.photosForm.patchValue({'carMake': ''});
    let sellType = '';
      sellType = this.photosForm.get('sellType').value;
      if (sellType != 'VENTA' && sellType != 'ALQUILA') {
        this.photosForm.patchValue({'sellType': 'VENTA'});
    }
    this.disabledField = false;
    this.photosForm.controls['negotiable'].enable();
  }

  setValidationVehicle() {
    const typeVehicleControl = this.photosForm.get('typeVehicle');
    const model = this.photosForm.get('model');
    const lineId = this.photosForm.get('lineId');
    const transmission = this.photosForm.get('transmission');
    const color = this.photosForm.get('color');
    const licensePlate = this.photosForm.get('licensePlate');
    const mileage = this.photosForm.get('mileage');
    const displacement = this.photosForm.get('displacement');
    const gas = this.photosForm.get('gas');
    const carMake = this.photosForm.get('carMake');
    const kindSeat = this.photosForm.get('typeOfSeat');
    const airbag = this.photosForm.get('airbag');
    const airConditioner = this.photosForm.get('airConditioner');
    const absBrakes = this.photosForm.get('absBrakes');
    const uniqueOwner = this.photosForm.get('uniqueOwner');
    const vehiclesTypeId = this.photosForm.get('vehiclesTypeId');
    typeVehicleControl.clearValidators();
    model.clearValidators();
    lineId.clearValidators();
    transmission.clearValidators();
    color.clearValidators();
    licensePlate.clearValidators();
    mileage.clearValidators();
    displacement.clearValidators();
    gas.clearValidators();
    carMake.clearValidators();
    kindSeat.clearValidators();
    airbag.clearValidators();
    airConditioner.clearValidators();
    absBrakes.clearValidators();
    uniqueOwner.clearValidators();
    vehiclesTypeId.clearValidators();

    if (this.subcategoryIsVehicle() || this.subcategoryIsMotos()) {
      vehiclesTypeId.setValidators([Validators.required]);
    }

    if (this.subcategoryIsVehicle()) {
      carMake.setValidators([Validators.required]);
      lineId.setValidators([Validators.required]);
      mileage.setValidators([Validators.required]);
      gas.setValidators([Validators.required]);
      color.setValidators([Validators.required]);
      transmission.setValidators([Validators.required]);
      licensePlate.setValidators([Validators.required]);
      model.setValidators([Validators.required]);
      typeVehicleControl.setValidators([Validators.required]);
      const request = {
        tipo: 1
      };
      if (!this.collectionService.getBrandsCars()) {
        this.collectionService.getVehicles(request).subscribe((response) => {
          if (response.body) {
            this.brandsList = response.body.brands;
            this.collectionService.setBrandsCars(this.brandsList);
          }
        }, (error) => {
          console.log(error);
        });
      } else {
        this.brandsList = this.collectionService.getBrandsCars();
      }
    } else if (this.subcategoryIsMotos()) {
      carMake.setValidators([Validators.required]);
      lineId.setValidators([Validators.required]);
      mileage.setValidators([Validators.required]);
      displacement.setValidators([Validators.required]);
      color.setValidators([Validators.required]);
      model.setValidators([Validators.required]);
      const request = {
        tipo: 2
      };
      if (!this.collectionService.getBrandsMotos()) {
        this.collectionService.getVehicles(request).subscribe((response) => {
          if (response.body) {
            this.brandsList = response.body.brands;
            this.collectionService.setBrandsMotos(this.brandsList);
          }
        }, (error) => {
          console.log(error);
        });
      } else {
        this.brandsList = this.collectionService.getBrandsMotos();
      }
    }

    vehiclesTypeId.updateValueAndValidity();
    typeVehicleControl.updateValueAndValidity();
    model.updateValueAndValidity();
    lineId.updateValueAndValidity();
    transmission.updateValueAndValidity();
    color.updateValueAndValidity();
    licensePlate.updateValueAndValidity();
    mileage.updateValueAndValidity();
    displacement.updateValueAndValidity();
    gas.updateValueAndValidity();
    carMake.updateValueAndValidity();
    kindSeat.updateValueAndValidity();
    airbag.updateValueAndValidity();
    airConditioner.updateValueAndValidity();
    absBrakes.updateValueAndValidity();
    uniqueOwner.updateValueAndValidity();
    this.changeDetectorRef.markForCheck();
  }


  setValidationImmovable () {
    const antiquity = this.photosForm.get('antiquity');
    const squareMeters = this.photosForm.get('squareMeters');
    const rooms = this.photosForm.get('rooms');
    const bathrooms = this.photosForm.get('bathrooms');
    const sellerType = this.photosForm.get('sellerType');
    const floor = this.photosForm.get('floor');
    const elevator = this.photosForm.get('elevator');
    const guardHouse = this.photosForm.get('guardHouse');
    const parking = this.photosForm.get('parking');

    antiquity.clearValidators();
    squareMeters.clearValidators();
    rooms.clearValidators();
    bathrooms.clearValidators();
    sellerType.clearValidators();
    floor.clearValidators();
    elevator.clearValidators();
    guardHouse.clearValidators();
    parking.clearValidators();


    if (this.subcategoryIsHouse() || this.subcategoryIsFlat()) {
      antiquity.setValidators([Validators.required]);
      squareMeters.setValidators([Validators.required]);
      rooms.setValidators([Validators.required]);
      bathrooms.setValidators([Validators.required]);
      sellerType.setValidators([Validators.required]);
      floor.setValidators([Validators.required]);
      elevator.setValidators([Validators.required]);
      guardHouse.setValidators([Validators.required]);
      parking.setValidators([Validators.required]);
    }


    antiquity.updateValueAndValidity();
    squareMeters.updateValueAndValidity();
    rooms.updateValueAndValidity();
    bathrooms.updateValueAndValidity();
    sellerType.updateValueAndValidity();
    floor.updateValueAndValidity();
    elevator.updateValueAndValidity();
    guardHouse.updateValueAndValidity();
    parking.updateValueAndValidity();
    this.changeDetectorRef.markForCheck();
  }

  setFashionValidation () {
    const genderId = this.photosForm.get('genderId');
    const colorFashion = this.photosForm.get('colorFashion');
    const reference = this.photosForm.get('reference');
    genderId.clearValidators();
    colorFashion.clearValidators();
    if (!this.showOptionsFashion) {
      genderId.setValidators([Validators.required]);
      colorFashion.setValidators([Validators.required]);
      reference.clearValidators();
    }
    genderId.updateValueAndValidity();
    colorFashion.updateValueAndValidity();
    reference.updateValueAndValidity();
    this.changeDetectorRef.markForCheck();
  }

  setLinesVehicle (id) {
    if (this.brandsList) {
      const brands = this.brandsList.filter(value => {
        return value.id == id;
      });
    this.photosForm.patchValue({'lineId': ''});
     if (brands && brands.length > 0) {
      this.modelList = brands[0].lines;
     }
     this.changeDetectorRef.markForCheck();
    }
  }

  closeModal() {
    this.isModalShowed = false;
  }

  openModal() {
    this.isModalShowed = true;
  }

  subcategoryIsVehicle(): boolean {
    const subcategoryValue = this.photosForm.get('subcategoryId').value;
    if (subcategoryValue) {
      const subcategory = this.findSubCategory(subcategoryValue);
      if (subcategory && subcategory.name === 'Carros') {
        return true;
      }
    }
    return false;
  }

  subcategoryIsMotos(): boolean {
    const subcategoryValue = this.photosForm.get('subcategoryId').value;
    if (subcategoryValue) {
      const subcategory = this.findSubCategory(subcategoryValue);
      if (subcategory && subcategory.name === 'Motos') {
        return true;
      }
    }
    return false;
  }


  subcategoryIsHouse(): boolean {
    const subcategoryValue = this.photosForm.get('subcategoryId').value;
    if (subcategoryValue) {
      const subcategory = this.findSubCategory(subcategoryValue);
      if (subcategory && subcategory.name === 'Casas') {
        return true;
      }
    }
    return false;
  }

  subcategoryIsFlat(): boolean {
    const subcategoryValue = this.photosForm.get('subcategoryId').value;
    if (subcategoryValue) {
      const subcategory = this.findSubCategory(subcategoryValue);
      if (subcategory && subcategory.name === 'Apartamentos') {
        return true;
      }
    }
    return false;
  }

  selectedComunity(idCategory: number ) {
    this.categorySelected = idCategory;
    this.subCategories = this.findCategory(idCategory).subcategories;
    this.photosForm.patchValue({'genderId': ''});
    this.genders = [];
    this.vehiclesType = [];
    this.currentSubcategory = '';
    this.subCategory = null;
    if (idCategory == 7 || idCategory == 6 || idCategory == 10) {
      let sellType = '';
      sellType = this.photosForm.get('sellType').value;
      if (sellType != 'VENTA' && sellType != 'ALQUILA') {
        this.photosForm.patchValue({'sellType': 'VENTA'});
      }
      this.disabledField = false;
      this.photosForm.controls['negotiable'].enable();
    }
  }

  resetPromo() {
    this.photosForm.patchValue({checkNewPrice: false});
    this.removeValidatorNewPrice();
  }

  selectedSubcategory(idSubcategory) {
    this.subCategory = this.findSubCategory(idSubcategory);
    this.photosForm.patchValue({'genderId': ''});
    this.photosForm.patchValue({'vehiclesTypeId': ''});
    this.genders = this.subCategory.generos;
    this.vehiclesType = this.subCategory.tipoVehiculos;
  }

  loadSizes() {
    if (this.photosForm.get('subcategoryId').value && this.photosForm.get('genderId').value) {
      const params = {
        'subcategoryId': this.photosForm.get('subcategoryId').value,
        'genderId': this.photosForm.get('genderId').value
      };
      this.getSizes(params);
    }
  }

  loadYearsModelVehicle() {
    const years = (new Date()).getFullYear() - 1968;
    for (let i = 0; i < years; i++) {
      this.yearsVehicle.push((new Date()).getFullYear() + 1 - i);
    }
  }

  private setInitialForm(config: ProductInterface) {

    /**Vehiculos**/
    let typeVehicle = '';
    let model = '';
    let lineId = '';
    let transmission = '';
    let color = '';
    let licensePlate = '';
    let mileage = 0;
    let displacement = '';
    let gas = '';
    let carMake = '';
    let kindSeat = 'TELA';
    let airbag = '';
    let airConditioner = '';
    let absBrakes = '';
    let uniqueOwner = '';
    let stock = 1;
    const request = {
      tipo: 1
    };
    let checkNewPrice = false;
    let newPrice;
    let vehiclesTypeId = '';

    if (config['subcategory'].name == 'Carros') {
      request.tipo = 1;
    } else if (config['subcategory'].name == 'Motos') {
      request.tipo = 2;
    }
    this.collectionService.getVehicles(request).subscribe((response) => {
      if (response.body) {
        this.brandsList = response.body.brands;
        if (config['vehicle']) {
          const vehicle  = config['vehicle'];
          carMake = vehicle['line'] ? vehicle['line'].brand.id : '';
          lineId = vehicle['line'] ? vehicle['line'].id : '';
          this.setLinesVehicle(carMake);
          this.photosForm.patchValue({'lineId': lineId});
        }
      }
    }, (error) => {
      console.log(error);
    });

  /**Vehiculos**/
  if (config['vehicle']) {
      const vehicle  = config['vehicle'];
      transmission = vehicle['transmission'] ? vehicle['transmission'] : '';
      color = vehicle['color'] ? vehicle['color'] : '';
      licensePlate = vehicle['licensePlate'] ? vehicle['licensePlate'] : '';
      mileage = vehicle['mileage'] ? vehicle['mileage'] : 0;
      displacement  = vehicle['displacement'] ? vehicle['displacement'] : '';
      gas = vehicle['gas'] ? vehicle['gas'] : '';
      kindSeat = vehicle['typeOfSeat'] ? vehicle['typeOfSeat'] : '';
      airbag = vehicle['airbag'] ? vehicle['airbag'] : '';
      airConditioner = vehicle['airConditioner'] ? vehicle['airConditioner'] : '';
      absBrakes = vehicle['absBrakes'] ? vehicle['absBrakes'] : '';
      uniqueOwner = vehicle['uniqueOwner'] ? vehicle['uniqueOwner'] : '';
      carMake = vehicle['line'] ? vehicle['line'].brand.id : '';
      lineId = vehicle['line'] ? vehicle['line'].id : '';
      vehiclesTypeId = vehicle['vehiclesType'] ? vehicle['vehiclesType'].id : '';
    }

    typeVehicle = config['typeVehicle'] ? config['typeVehicle'] : '';
    model = config['model'] ? config['model'] : '';
    stock = config['stock'] ? config['stock'] : 1;


    /**Inmuebles**/
    let antiquity = '';
    let squareMeters = '';
    let rooms = '';
    let bathrooms = '';
    let sellerType = '';
    let floor = '';
    let elevator = false;
    let guardHouse = 'No aplica';
    let parking = false;
    let canonQuota = '';
    let fullyFurnished = false;
    let pool = false;
    let childishGames = false;
    let usefulRoom = false;
    let squareMetersTerrain = '';
    let socialClass = '';

    if (config['immovable']) {
      const immovable  = config['immovable'];
      antiquity = immovable['antiquity'] ? immovable['antiquity'] : '';
      squareMeters = immovable['squareMeters'] ? immovable['squareMeters'] : '';
      rooms = immovable['rooms'] ? immovable['rooms'] : 'No tiene';
      bathrooms  = immovable['bathrooms'] ? immovable['bathrooms'] : '';
      sellerType = immovable['sellerType'] ? immovable['sellerType'] : '';
      floor = immovable['floor'] ? immovable['floor'] : '';
      elevator = immovable['elevator'] ? immovable['elevator'] : false;
      guardHouse = immovable['guardHouse'] ? immovable['guardHouse'] : '12 horas';
      parking = immovable['parking'] ? immovable['parking'] : false;
      canonQuota = immovable['canonQuota'] ? immovable['canonQuota'] : '';
      fullyFurnished = immovable['fullyFurnished'] ? immovable['fullyFurnished'] : '';
      pool = immovable['pool'] ? immovable['pool'] : '';
      childishGames = immovable['childishGames'] ? immovable['childishGames'] : '';
      usefulRoom = immovable['usefulRoom'] ? immovable['usefulRoom'] : '';
      squareMetersTerrain = immovable['squareMetersTerrain'] ? immovable['squareMetersTerrain'] : '';
      socialClass = immovable['socialClass'] ? immovable['socialClass'] : '';
    }

    /**Moda**/
    let genderId = '';
    let colorFashion = '';
    let brandFashion = '';
    if (config['children'] && config['children'].length > 0) {
       genderId = config['children'][0].genderId;
       colorFashion = config['children'][0].color;
       brandFashion = config['children'][0].brand;
    }

    if (config['sellType'] === 'GRATIS') {
      this.disabledField = true;
      this.photosForm.controls['negotiable'].disable();
    }

    if (config['sellType'] === 'SUBASTA') {
      this.disabledField = true;
      this.disabledFieldType = true;
      this.photosForm.controls['negotiable'].disable();
    }

    if (this.product) {
      if (config.subcategory.name == 'Motos' ||  config.subcategory.name == 'Carros'
      || config.subcategory.name == 'Casas' || config.subcategory.name == 'Apartamentos') {
        this.photosForm.get('category').disable();
        this.photosForm.get('subcategoryId').disable();
      }

      if (config.subcategory && config.subcategory.category && config.subcategory.category.name == 'Moda y accesorios') {
        this.photosForm.get('category').disable();
      }

      if (config.subcategory && config.subcategory.category && config.subcategory.category.name == 'Moda y accesorios'
      && config['children'] && config['children'].length > 0) {
        this.photosForm.get('subcategoryId').disable();
      }

      if (this.isActivePromo(this.product)) {
        newPrice = config.price;
        config.price = config['oldPrice'] ? config['oldPrice'] : null;
        checkNewPrice = true;
      }
    }

    this.photosForm = this.fb.group({
      name: [config.name, [Validators.required]],
      price: [config.price, [Validators.required]],
      reference: [config.reference, [Validators.required]],
      currency: [config.currency, [Validators.required]],
      'subcategoryId': [config['subcategory'].id, [Validators.required]],
      'stock': [stock, [Validators.required, Validators.min(1), Validators.max(9999)]],
      used: [config.used, [Validators.required]],
      visible: [config.visible, [Validators.required]],
      contactSeller: [config.contactSeller, [Validators.required]],
      'sellType': [config['sellType'], [Validators.required]],
      description: [config.description, [Validators.required]],
      negotiable: [{ value: config.negotiable, disabled: false }, []],
      'publishUntil': [config['publishUntil'], []],
      'typeVehicle': [typeVehicle, []],
      'model': [model, []],
      'lineId': [lineId, []],
      'transmission': [transmission, []],
      'color': [color, []],
      'licensePlate': [licensePlate, []],
      'mileage': [mileage, []],
      'displacement': [displacement, []],
      'gas': [gas, []],
      'carMake': [carMake, []],
      'typeOfSeat': [kindSeat, []],
      'airbag': [airbag, []],
      'airConditioner': [airConditioner, []],
      'absBrakes': [absBrakes, []],
      'uniqueOwner': [uniqueOwner, []],
      'checkNewPrice': [checkNewPrice, []],
      'specialPrice': [newPrice, []],
      category: [config['category'], [Validators.required]],
      vehiclesTypeId: [vehiclesTypeId, []],

      antiquity : [antiquity, []],
      squareMeters: [squareMeters, []],
      rooms: [rooms, []],
      bathrooms: [bathrooms, []],
      sellerType: [sellerType, []],
      floor: [floor, []],
      elevator: [elevator, []],
      guardHouse: [guardHouse, []],
      parking: [parking, []],
      canonQuota: [canonQuota, []],
      fullyFurnished: [fullyFurnished, []],
      pool: [pool, []],
      childishGames: [childishGames, []],
      usefulRoom: [usefulRoom, []],
      squareMetersTerrain: [squareMetersTerrain, []],
      socialClass: [socialClass, []],
      children: [],
      genderId: [genderId, []],
      colorFashion: [colorFashion, []],
      brandFashion: [brandFashion, []],

    }, { validator: validatePrice });

    this.setInitialFormFashion(this.getInitialConfigSize());
    if (this.product) {
      if (this.isActivePromo(this.product)) {
        const price = this.photosForm.get('specialPrice').value;
        this.maxValueNewPrice = price;
        const specialPrice = this.photosForm.get('specialPrice');
        specialPrice.clearValidators();
        specialPrice.setValidators([Validators.required, Validators.max(this.maxValueNewPrice)]);
        specialPrice.updateValueAndValidity();
      }

      /**Moda**/
      if (config['children'] && config['children'].length > 0) {
        this.setInitialFormFashion(config['children']);
      }

      if (config.subcategory && config.subcategory.category && config.subcategory.category.name == 'Moda y accesorios' &&
      config['children'] && config['children'].length > 0) {
        this.photosForm.get('genderId').disable();
        const referenceForm = this.photosForm.get('reference');
        referenceForm.clearValidators();
        referenceForm.updateValueAndValidity();
      }

    }

    if (this.userEdit && !this.userEdit['is-admin-store']) {
      const referenceForm = this.photosForm.get('reference');
      referenceForm.clearValidators();
      referenceForm.updateValueAndValidity();
    }

  }

  private setInitialFormFashion(children) {
    this.formFashion = this.fb.group({
      children: this.fb.array(
        this.createItem(children)
      )
    });
  }

  private initialSize() {
    const children = {
      'sizeId': '',
      'stock': 1,
      'reference': ''
    };
    return children;
  }

  private getInitialConfigSize() {
    const children = [
      {
        'sizeId': '',
        'stock': 1,
        'reference': ''
      }
    ];
    return children;
  }

  private createItem(childrenForm) {
    const children = childrenForm.map(child => {
      return this.fb.group({
        'sizeId': [child['sizeId'], [Validators.required]],
        'stock': [child['stock'], [Validators.required]],
        'reference': [child['reference'], [Validators.required]]
      });
    });
    return children;
  }

  addSizeFashion(): void {
    if (this.formFashion) {
      const children = this.formFashion.get('children') as FormArray;
      children.push(this.createBasicItem(this.initialSize()));
    }
  }

  removeBannerColombia(id) {
    if (this.formFashion) {
      const children = this.formFashion.get('children').controls;
      if (children.length > 1) {
        this.formFashion.get('children').controls = children.filter((item, index) => {
          if (index != id) {
            return item;
          }
        });
      }
    }
  }

  private createBasicItem(children) {
    return this.fb.group({
        'sizeId': [children['sizeId'], [Validators.required]],
        'stock': [children['stock'], [Validators.required]],
        'reference': [children['reference'], [Validators.required]]
      });
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
      const publishUntil  = moment(this.product['publishUntil']).toDate();
      objectDate = {
        date: {
          year: publishUntil.getFullYear(),
          month: publishUntil.getMonth() + 1,
          day: publishUntil.getDate()
          }
      };
      this.product['publishUntil'] = objectDate;
    }

    /**Moneda por defecto**/
    let currency = 'COP';
    switch (this.countryId) {
      case 1:
        currency = 'COP';
        break;
      case 9:
        currency = 'GTQ';
        break;
      default:
        currency = 'USD';
        break;
    }

    const product = {
      name: null,
      price: null,
      reference: null,
      'specialPrice': null,
      currency: currency,
      'subcategory': {id : ''},
      stock: 1,
      used: false,
      visible: true,
      contactSeller: false,
      'sellType': 'VENTA',
      description: null,
      'publishUntil': objectDate,
      negotiable: true,
      checkNewPrice: false,
      category: ''
    };

    return Object.assign({}, product, this.product) as ProductInterface;
  }

  private setCategoryDefault(subCategory: SubcategoryInterface) {
    const options = this.categorySelectElem.nativeElement.options;
    const length = options.length;
    for (let index = 0; index < length; index++) {
      options[index].selected = options[index].value == subCategory.category.id;
      if (options[index].value == subCategory.category.id) {
        this.selectedComunity(subCategory.category.id as number);
        this.photosForm.controls['category'].setValue(subCategory.category.id);
        this.photosForm.controls['subcategoryId'].setValue(subCategory.id);
        this.loadFashionGender(subCategory.id);
        this.loadTypeVehicle(subCategory.id);
      }
    }
  }

  loadFashionGender(subcategoryValue) {
    const subcategory = this.findSubCategory(subcategoryValue);
    if (subcategory && subcategory.generos) {
      this.genders = subcategory.generos;
      if (this.product && this.product['children'] && this.product['children'][0]) {
        this.photosForm.controls['genderId'].setValue(this.product['children'][0].genderId);
        this.loadSizes();
      }
    }
  }

  loadTypeVehicle(subcategoryValue) {
    const subcategory = this.findSubCategory(subcategoryValue);
    if (subcategory && subcategory.tipoVehiculos) {
      this.vehiclesType = subcategory.tipoVehiculos;
    }
  }

  private findCategory(id: number) {
    return this.categories.find(
      (category: CategoryInterface) => category.id == id
    );
  }

  private findSubCategory(id: number) {
    return this.subCategories.find(subCategory => subCategory.id == id);
  }

  private getPublishUntilDate(): Date {
    /** El 30 debe ser congifurable DEUDA TECNICA */
    const date = new Date();
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
    photos = photos.map((item) => {
      const photo = {
        photoId: item.id,
        urlPhoto: item.url,
        position: item.position
      };
      return photo;
    });
    this.photosUploaded = [].concat(photos);
    if (this.maxNumberImg > 0 && this.maxNumberImg <= this.maxNumberPhotos) {
      this.maxNumberImg = this.maxNumberImg - this.photosUploaded.length;
    }
  }

  private removePhoto(id: number) {
    this.photosUploaded = this.photosUploaded.filter(photo => photo.photoId != id);
    if (this.maxNumberImg >= 0 && this.maxNumberImg <= this.maxNumberPhotos) {
      this.maxNumberImg = this.maxNumberPhotos - (this.photosUploaded.length - this.imageInput.files.length ) ;
    }
  }

  private defineSubastaTimes() {
    this.minDate = moment().format('YYYY-MM-DD');
    this.maxDate = moment().add(30, 'days').format('YYYY-MM-DD');
  }

  get formIsInValid() {
    return this.photosForm.invalid;
  }

  get showOptionsVehicles () {
    if (this.photosForm.get('category').value == 6) {
      if (this.photosForm.get('subcategoryId').value != 11) {
        return false;
      }
    }
    return true;
  }

  get showOptionEstate () {
    if (this.photosForm.get('category').value == 7) {
      return false;
    }
    return true;
  }

  get showOptionsFashion () {
    if (this.photosForm.get('category').value == 10) {
      return false;
    }
    return true;
  }

  get showOptionsVehicle () {
    if (this.photosForm.get('category').value == 6) {
      if (this.photosForm.get('subcategoryId').value == 9 || this.photosForm.get('subcategoryId').value == 10) {
        return true;
      }
    }
    return false;
  }

  addStock() {
    if (this.showOptionsVehicles &&  this.showOptionEstate) {
      if (this.photosForm.get('sellType').value == 'VENTA' && this.photosForm.get('stock').value < 9999) {
        let stock =  this.photosForm.get('stock').value;
        stock = ++stock;
        this.photosForm.patchValue({stock: stock});
      }
    }
  }

  minusStock() {
    if (this.showOptionsVehicles && this.showOptionEstate) {
      if (this.photosForm.get('sellType').value == 'VENTA' && this.photosForm.get('stock').value > 1) {
        let stock =  this.photosForm.get('stock').value;
        stock = --stock;
        this.photosForm.patchValue({stock: stock});
      }
    }
  }

  addStockSize(sizeStock, element) {
    if (this.photosForm.get('sellType').value == 'VENTA' && sizeStock < 9999) {
      let stock = sizeStock;
      stock = ++stock;
      element.patchValue({ stock: stock });
    }
  }

  minusStockSize(sizeStock , element) {
    if (this.photosForm.get('sellType').value == 'VENTA' && sizeStock > 1) {
      let stock = sizeStock;
      stock = --stock;
      element.patchValue({ stock: stock });
    }
  }

  get isNewPriceShow() {
    if (!this.isGuatemala && this.isPromoDate && this.photosForm.get('sellType').value == 'VENTA' &&
    (this.photosForm.get('price').value || this.photosForm.get('price').value > 0)) {
      return true;
    }
    return false;
  }

  get isPromoDate() {
    if (this.courrentDate >= this.startDate && this.courrentDate <= this.endDate) {
      return true;
    }
    return false;
  }


  checkNewPriceChange() {
    if (this.categorySelected && this.photosForm.get('checkNewPrice').value && this.photosForm.get('price').value ) {
      const newPrice = this.photosForm.get('specialPrice');
      const category = this.findCategory(this.categorySelected);
      const percentagePrice = category['porcentajeMinimoBajoPrecio'];
      const price = this.photosForm.get('price').value ;

      let maxNewPrice = (price * percentagePrice) / 100;
      maxNewPrice = price - maxNewPrice;
      maxNewPrice = Math.floor(maxNewPrice);
      this.maxValueNewPrice = maxNewPrice;
      newPrice.clearValidators();
      newPrice.setValidators([Validators.required, Validators.max(maxNewPrice)]);
      newPrice.updateValueAndValidity();
      this.photosForm.patchValue({ 'specialPrice': maxNewPrice });
      this.changeDetectorRef.markForCheck();
    } else  {
      this.removeValidatorNewPrice();
      if (!this.categorySelected ) {
        this.photosForm.patchValue({'checkNewPrice': false});
        const newPrice = this.photosForm.get('specialPrice');
        newPrice.clearValidators();
        newPrice.setErrors({ 'invalid': true });
        newPrice.markAsDirty({ onlySelf: true });
        newPrice.markAsTouched({ onlySelf: true });
        newPrice.setValidators([Validators.required, isCategorySelected.bind(this)]);
        newPrice.updateValueAndValidity();

      }
    }
  }

  get isErrorCategoryNewPrice() {
    const newPrice = this.photosForm.get('specialPrice');
    if (newPrice.errors && newPrice.errors.isCategory) {
      return true;
    }
    return false;
  }

  removeValidatorNewPrice() {
    const newPrice = this.photosForm.get('specialPrice');
    this.photosForm.patchValue({'specialPrice': null});
    newPrice.clearValidators();
    newPrice.updateValueAndValidity();
  }

  isActivePromo(product) {
    if (product['special-date'] && product['special-date'].active
    || product['specialDate'] && product['specialDate'].active) {
      return true;
    }
    return false;
  }

  loadOrderPhotos () {
    let order = [];
    order = this.photosUploaded.map((photo, index) => {
      return {
        'photoId': photo.photoId,
        'position': index + 1
      };
    });
    return order;
  }

  openTermsModal(): void {
    this.modalTermsIsOpen = true;
    }

  closeTermsModal() {
    this.modalTermsIsOpen = false;
  }

  acceptTerms(checkbox) {
    this.photosForm.patchValue({
    'termsCheckbox': true
    });
    // checkbox.checked = true;
    this.closeTermsModal();
  }

  clearInputReference() {
    this.errorference = '';
  }

}
