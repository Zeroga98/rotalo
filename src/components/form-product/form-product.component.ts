import { DATAPICKER_CONFIG } from './../../commons/constants/datapicker.config';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import { EventEmitter, Output, Input, OnChanges, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
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
import { UserService } from '../../services/user.service';
import { CollectionSelectService } from '../../services/collection-select.service';
import { LISTA_TRANSMISION, COLOR, PLACA, CILINDRAJE, COMBUSTIBLE } from './vehicle.constant';
import { START_DATE_BF, END_DATE_BF, START_DATE } from '../../commons/constants/dates-promos.contants';
import * as Muuri from 'muuri';

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

function isCategorySelected( c: AbstractControl ): { [key: string]: boolean } | null {
  if (this.categorySelected) {
    return null;
  }
  return { isCategory: true };
}

@Component({
  selector: 'form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormProductComponent implements OnInit, OnChanges, AfterViewInit  {
  @Input() product: ProductInterface;
  @Output() publish: EventEmitter<any> = new EventEmitter();
  @ViewChild('categorySelect', { read: ElementRef }) categorySelectElem: ElementRef;
  @ViewChild('imageInput') imageInput: ImageUploadComponent;
  photosForm: FormGroup;
  photosUploaded: Array<any> = [];
  categories: Array<CategoryInterface> = [];
  subCategories: Array<SubcategoryInterface> = [];
  subCategory: SubcategoryInterface;
  yearsVehicle: Array<any> = [];
  transmissionList: Array<any> = LISTA_TRANSMISION;
  colorList: Array<any> = COLOR;
  vehicleNumberList: Array<any> = PLACA;
  cylinderList: Array<any> = CILINDRAJE;
  combustibleList: Array<any> = COMBUSTIBLE;
  carMakeList: Array<any> = COMBUSTIBLE;
  vehicleProperties: Array<any> = ['Particular', 'Público'];
  modelList: Array<any> = [];
  brandsList: Array<any> = [];
  linesList: Array<any> = [];
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
    this.getCountries();
    this.defineSubastaTimes();
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
   // let gridd = new Muuri('.placeholder-container', {dragEnabled: true});

    const grid = new Muuri('.grid' , {
      dragEnabled: true,
      layout: 'instant'
    });
    this.changeDetectorRef.markForCheck();
  }

  ngOnChanges(): void {
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
    this.changeDetectorRef.markForCheck();
  }

  async getInfoUser() {
    this.userEdit = await this.userService.getInfoUser();
    if (this.userEdit && this.userEdit.company && this.userEdit.company.community) {
      this.communityName = this.userEdit.company.community.name;
    }
    this.onInfoRetrieved(this.userEdit);
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

  get isColombia(){
    return this.countryId == 1;
  }

  get isGuatemala(){
    return this.countryId == 9;
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
    this.setValidationVehicle();
    if (!this.formIsInValid && (this.city['id']) &&  this.photosUploaded.length > 0  ) {
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
              'negotiable': false
            };
          }
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
        params = Object.assign({}, this.photosForm.value, photosIds, dataAdditional, {
          'city-id': this.city['id']
        });
        if (this.photosForm.get('sell-type').value !== 'SUBASTA') {
          delete params['publish-until'];
        }
      } else {

      const publishDate = {
          'published-at': new Date()
      };
        // const photosIds2 = { 'photo-ids': ['10083'] };
        params = Object.assign({}, this.photosForm.value, photosIds, publishDate, dataAdditional, {
          'city-id': this.city['id']
        });

      }
      this.photosUploaded.length = 0;
      /**Mejora hacer nested formgroups**/
      delete params['line-id'];
      delete params['transmission'];
      delete params['color'];
      delete params['license-plate'];
      delete params['mileage'];
      delete params['displacement'];
      delete params['gas'];
      delete params['carMake'];
      delete params['type-of-seat'];
      delete params['airbag'];
      delete params['air-conditioner'];
      delete params['abs-brakes'];
      delete params['unique-owner'];
      if (!this.photosForm.get('checkNewPrice').value) {
        delete params['special-price'];
      }
      delete params['checkNewPrice'];
      if (this.subcategoryIsVehicle() || this.subcategoryIsMotos()) {
          const vehicle  = {
            'vehicle-type': this.subcategoryIsVehicle() ? 'AUTO' : 'MOTO',
            'line-id': this.photosForm.get('line-id').value,
            'transmission': this.photosForm.get('transmission').value,
            'color': this.photosForm.get('color').value,
            'license-plate': this.photosForm.get('license-plate').value,
            'mileage': this.photosForm.get('mileage').value,
            'displacement': this.photosForm.get('displacement').value,
            'gas': this.photosForm.get('gas').value,
            'type-of-seat': this.photosForm.get('type-of-seat').value,
            'airbag': this.photosForm.get('airbag').value,
            'air-conditioner': this.photosForm.get('air-conditioner').value,
            'abs-brakes': this.photosForm.get('abs-brakes').value,
            'unique-owner': this.photosForm.get('unique-owner').value
          };
          params.vehicle = vehicle;

      }
      params.stock = this.photosForm.get('stock').value;
      const request = {
        'data': {
          'attributes': params
        }
      };

      this.publish.emit(request);


    } else {
      this.validateAllFormFields(this.photosForm);
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
    } else if (!this.product && elements && elements[3]) {
      elements[3].scrollIntoView({ block: 'start', behavior: 'smooth' });
    }else if (this.product && elements && elements[1]) {
      elements[1].scrollIntoView({ block: 'start', behavior: 'smooth' });
    }else if (this.errorState || this.errorCity) {
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

  onUploadImageFinished(event) {
    this.errorUploadImg = false;
    this.errorMaxImg = false;
    this.photosCounter++;
    this.photosService.updatePhoto(event.file).subscribe(
      (response) => {
        const photo = Object.assign({}, response, { file: event.file });
        console.log(photo);
        this.photosUploaded.push(photo);
        console.log(this.photosUploaded);
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

  uploadFiles() {
    console.log(this.imageInput);
    const element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
    element.click();
  //  this.imageInput.processUploadedFiles();
 //   console.log(this.imageInput.processUploadedFiles());
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

  resetFormsVehicle() {
    this.photosForm.patchValue({stock: 1});
    this.photosForm.patchValue({'line-id': ''});
    this.photosForm.patchValue({'carMake': ''});
    let sellType = '';
      sellType = this.photosForm.get('sell-type').value;
      if (sellType != 'VENTA' && sellType != 'ALQUILA') {
        this.photosForm.patchValue({'sell-type': 'VENTA'});
    }
    this.disabledField = false;
    this.photosForm.controls['negotiable'].enable();
  }

  setValidationVehicle() {
    const typeVehicleControl = this.photosForm.get('type-vehicle');
    const model = this.photosForm.get('model');
    const lineId = this.photosForm.get('line-id');
    const transmission = this.photosForm.get('transmission');
    const color = this.photosForm.get('color');
    const licensePlate = this.photosForm.get('license-plate');
    const mileage = this.photosForm.get('mileage');
    const displacement = this.photosForm.get('displacement');
    const gas = this.photosForm.get('gas');
    const carMake = this.photosForm.get('carMake');
    const kindSeat = this.photosForm.get('type-of-seat');
    const airbag = this.photosForm.get('airbag');
    const airConditioner = this.photosForm.get('air-conditioner');
    const absBrakes = this.photosForm.get('abs-brakes');
    const uniqueOwner = this.photosForm.get('unique-owner');
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

  setLinesVehicle (id) {
    if (this.brandsList) {
      const brands = this.brandsList.filter(value => {
        return value.id == id;
      });
    this.photosForm.patchValue({'line-id': ''});
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
    const subcategoryValue = this.photosForm.get('subcategory-id').value;
    if (subcategoryValue) {
      const subcategory = this.findSubCategory(subcategoryValue);
      if (subcategory && subcategory.name === 'Carros') {
        return true;
      }
    }
    return false;
  }

  subcategoryIsMotos(): boolean {
    const subcategoryValue = this.photosForm.get('subcategory-id').value;
    if (subcategoryValue) {
      const subcategory = this.findSubCategory(subcategoryValue);
      if (subcategory && subcategory.name === 'Motos') {
        return true;
      }
    }
    return false;
  }

  selectedComunity(idCategory: number ) {
    this.categorySelected = idCategory;
    this.subCategories = this.findCategory(idCategory).subcategories;
    this.currentSubcategory = '';
    this.subCategory = null;
    if (idCategory == 7 || idCategory == 6) {
      let sellType = '';
      sellType = this.photosForm.get('sell-type').value;
      if (sellType != 'VENTA' && sellType != 'ALQUILA') {
        this.photosForm.patchValue({'sell-type': 'VENTA'});
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
  }

  loadYearsModelVehicle() {
    const years = (new Date()).getFullYear() - 1968;
    for (let i = 0; i < years; i++) {
      this.yearsVehicle.push((new Date()).getFullYear() + 1 - i);
    }
  }

  private setInitialForm(config: ProductInterface) {
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
          this.photosForm.patchValue({'line-id': lineId});
        }
      }
    }, (error) => {
      console.log(error);
    });

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
    }

    typeVehicle = config['typeVehicle'] ? config['typeVehicle'] : '';
    model = config['model'] ? config['model'] : '';
    stock = config['stock'] ? config['stock'] : 1;


    if (config['sell-type'] === 'GRATIS') {
      this.disabledField = true;
      this.photosForm.controls['negotiable'].disable();
    }

    if (config['sell-type'] === 'SUBASTA') {
      this.disabledField = true;
      this.disabledFieldType = true;
      this.photosForm.controls['negotiable'].disable();
    }

    if (this.product) {
      if (config.subcategory.name == 'Motos' ||  config.subcategory.name == 'Carros') {
        this.photosForm.get('category').disable();
        this.photosForm.get('subcategory-id').disable();
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
      currency: [config.currency, [Validators.required]],
      'subcategory-id': [config['subcategory'].id, [Validators.required]],
      'stock': [stock, [Validators.required, Validators.min(1), Validators.max(9999)]],
      used: [config.used, [Validators.required]],
      visible: [config.visible, [Validators.required]],
      'sell-type': [config['sell-type'], [Validators.required]],
      description: [config.description, [Validators.required]],
      negotiable: [{ value: config.negotiable, disabled: false }, []],
      'publish-until': [config['publish-until'], []],
      'type-vehicle': [typeVehicle, []],
      'model': [model, []],
      'line-id': [lineId, []],
      'transmission': [transmission, []],
      'color': [color, []],
      'license-plate': [licensePlate, []],
      'mileage': [mileage, []],
      'displacement': [displacement, []],
      'gas': [gas, []],
      'carMake': [carMake, []],
      'type-of-seat': [kindSeat, []],
      'airbag': [airbag, []],
      'air-conditioner': [airConditioner, []],
      'abs-brakes': [absBrakes, []],
      'unique-owner': [uniqueOwner, []],
      'checkNewPrice': [checkNewPrice, []],
      'special-price': [newPrice, []],
      category: [config['category'], [Validators.required]],
    }, { validator: validatePrice });

    if (this.product) {
      if (this.isActivePromo(this.product)) {
        const price = this.photosForm.get('special-price').value;
        this.maxValueNewPrice = price;
        const specialPrice = this.photosForm.get('special-price');
        specialPrice.clearValidators();
        specialPrice.setValidators([Validators.required, Validators.max(this.maxValueNewPrice)]);
        specialPrice.updateValueAndValidity();
      }
    }

  //  this.changeDetectorRef.markForCheck();
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
      'special-price': null,
      currency: currency,
      'subcategory': {id : ''},
      stock: 1,
      used: false,
      visible: true,
      'sell-type': 'VENTA',
      description: null,
      'publish-until': objectDate,
      negotiable: true,
      checkNewPrice: false,
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

  private defineSubastaTimes() {
    this.minDate = moment().format('YYYY-MM-DD');
    this.maxDate = moment().add(30, 'days').format('YYYY-MM-DD');
  }

  get formIsInValid() {
    return this.photosForm.invalid;
  }

  get showOptionsVehicles () {
    if (this.photosForm.get('category').value == 6) {
      if (this.photosForm.get('subcategory-id').value != 11) {
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


  addStock() {
    if (this.showOptionsVehicles &&  this.showOptionEstate) {
      if (this.photosForm.get('sell-type').value == 'VENTA' && this.photosForm.get('stock').value < 9999) {
        let stock =  this.photosForm.get('stock').value;
        stock = ++stock;
        this.photosForm.patchValue({stock: stock});
      }
    }
  }

  minusStock() {
    if (this.showOptionsVehicles && this.showOptionEstate) {
      if (this.photosForm.get('sell-type').value == 'VENTA' && this.photosForm.get('stock').value > 1) {
        let stock =  this.photosForm.get('stock').value;
        stock = --stock;
        this.photosForm.patchValue({stock: stock});
      }
    }
  }

  get isNewPriceShow() {
    if (!this.isGuatemala && this.isPromoDate && this.photosForm.get('sell-type').value == 'VENTA' &&
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
      const newPrice = this.photosForm.get('special-price');
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
      this.photosForm.patchValue({ 'special-price': maxNewPrice });
      this.changeDetectorRef.markForCheck();
    } else  {
      this.removeValidatorNewPrice();
      if (!this.categorySelected ) {
        this.photosForm.patchValue({'checkNewPrice': false});
        const newPrice = this.photosForm.get('special-price');
        newPrice.clearValidators();
        newPrice.setErrors({ 'invalid': true });
        newPrice.markAsDirty({ onlySelf: true });
        newPrice.markAsTouched({ onlySelf: true });
        newPrice.setValidators([Validators.required, isCategorySelected.bind(this)]);
        newPrice.updateValueAndValidity();
        this.changeDetectorRef.markForCheck();
      }
    }
  }

  get isErrorCategoryNewPrice() {
    const newPrice = this.photosForm.get('special-price');
    if (newPrice.errors && newPrice.errors.isCategory) {
      return true;
    }
    return false;
  }

  removeValidatorNewPrice() {
    const newPrice = this.photosForm.get('special-price');
    this.photosForm.patchValue({'special-price': null});
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

}
