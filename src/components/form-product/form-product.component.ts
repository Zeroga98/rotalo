import { DATAPICKER_CONFIG } from './../../commons/constants/datapicker.config';
import { PhotoInterface } from './../../commons/interfaces/photo.interface';
import { ProductInterface } from "./../../commons/interfaces/product.interface";
import { EventEmitter, Output, Input, OnChanges, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { CategoryInterface } from "../../commons/interfaces/category.interface";
import { SubcategoryInterface } from "../../commons/interfaces/subcategory.interface";
import { PhotosService } from "../../services/photos.service";
import { CategoriesService } from "../../services/categories.service";
import { IMAGE_LOAD_STYLES } from './image-load.constant';
import * as moment from 'moment';
import { IMyDpOptions } from 'mydatepicker';
import { ROUTES } from '../../router/routes';
import { Router } from '@angular/router';
import { UtilsService } from '../../util/utils.service';

@Component({
  selector: "form-product",
  templateUrl: "./form-product.component.html",
  styleUrls: ["./form-product.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormProductComponent implements OnInit, OnChanges {
  @Input() product: ProductInterface;
  @Output() publish: EventEmitter<any> = new EventEmitter();
  @ViewChild("categorySelect", { read: ElementRef }) categorySelectElem: ElementRef;
  photosForm: FormGroup;
  photosUploaded: Array<any> = [];
  categories: Array<CategoryInterface> = [];
  subCategories: Array<SubcategoryInterface> = [];
  subCategory: SubcategoryInterface;
  modelsVehicle: Array<any> = [];
  vehicleProperties: Array<any> = ["Particular", "Público"];
  currentSubcategory: String = "";
  customStyleImageLoader = IMAGE_LOAD_STYLES;
  isModalShowed: boolean = false;
  disabledField = false;
  disabledFieldType = false;
  datePickerOptions: IMyDpOptions = DATAPICKER_CONFIG;
  minDate: string;
  maxDate: string;
  errorUploadImg = false;

  constructor(
    private router: Router,
    private photosService: PhotosService,
    private categoryService: CategoriesService,
    private changeDetectorRef: ChangeDetectorRef,
    private utilsService: UtilsService
  ) {
    this.defineSubastaTimes();
    this.changeDetectorRef.markForCheck();
  }

  async ngOnInit() {
    try {
      this.setInitialForm(this.getInitialConfig());
      this.categories = await this.categoryService.getCategories();
      this.loadYearsModelVehicle();
      this.changeDetectorRef.markForCheck();
    } catch (error) {}
  }


  changeKindOfProduct(evt) {
    this.photosForm.controls['negotiable'].enable();
    if (evt === "GRATIS") {
      this.photosForm.patchValue({price: 0});
      this.disabledField = true;
    }else if (evt === "SUBASTA") {
      const elem = document.getElementById("checkTerms") as any;
      elem.checked = true;
      this.disabledField = false;
      this.photosForm.controls['negotiable'].disable();
    }else {
      this.disabledField = false;
    }
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
      }, 20);
    }
    this.changeDetectorRef.markForCheck();
  }

  async publishPhoto(form) {
    const photosIds = { "photo-ids": this.getPhotosIds() };
    let dateMoment: any = moment(this.photosForm.value['publish-until'].formatted, 'YYYY-MM-DD');
    let dataAdditional;
    if (this.photosForm.get('sell-type').value === 'SUBASTA') {
        dataAdditional = {
          'publish-until': dateMoment.toDate(),
          'negotiable': true
        };
    }else {
      dataAdditional = {
        'publish-until': this.getPublishUntilDate(),
      };
    }
    const publishDate = {
      "published-at": new Date()
    };
    const params = Object.assign({}, this.photosForm.value, photosIds, publishDate, dataAdditional);
    this.photosUploaded.length = 0;
    this.publish.emit(params);

  }

  async onUploadImageFinished(event) {
    this.errorUploadImg = false;
    try {
     this.utilsService.getOrientation(event.file, function(orientation) {
        this.utilsService.resetOrientation(event.src, orientation , function(resetBase64Image) {
          event.src = resetBase64Image;
        });
     }.bind(this));
      const response = await this.photosService.updatePhoto(event.file);
      const photo = Object.assign({}, response, { file: event.file });
      this.photosUploaded.push(photo);
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      this.errorUploadImg = true;
      console.error("Error: ", error);
      this.changeDetectorRef.markForCheck();
    }
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
      console.error("error: ", error);
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
    /**No quemar 'Carros' */
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
    this.currentSubcategory = "";
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
    let typeVehicle = "";
    let model = "";

    if (config["type-vehicle"] && config["model"]){
      typeVehicle = config["type-vehicle"];
      model = config["model"];
    }

    if (config["sell-type"] === "GRATIS") {
      this.disabledField = true;
    }

    if (config["sell-type"] === "SUBASTA") {
      this.disabledField = true;
      this.disabledFieldType = true;
      this.photosForm.controls['negotiable'].disable();
    }

    this.photosForm = new FormGroup({
      name: new FormControl(config.name, [Validators.required]),
      price: new FormControl(config.price, [Validators.required]),
      currency: new FormControl(config.currency, [Validators.required]),
      "subcategory-id": new FormControl(config["subcategory-id"], [Validators.required]),
      used: new FormControl(config.used, [Validators.required]),
      visible: new FormControl(config.visible, [Validators.required]),
      "sell-type": new FormControl(config["sell-type"], [Validators.required]),
      description: new FormControl(config.description, [Validators.required]),
      negotiable: new FormControl({value: config.negotiable, disabled: false}, []),
      'publish-until': new FormControl(config['publish-until'], []),
      "type-vehicle": new FormControl(typeVehicle, []),
      "model": new FormControl(model, []),
    });

  }

  private getInitialConfig(): ProductInterface {
    const date = new Date();
    const product: ProductInterface = {
      name: null,
      price: null,
      currency: "COP",
      "subcategory-id": "",
      used: "",
      visible: "",
      "sell-type": "",
      description: null,
      'publish-until': {
        date: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
          }
        },
      negotiable: true
    };
    return Object.assign({}, product, this.product) as ProductInterface;
  }

  private getPhotosIds(): Array<string> {
    return this.photosUploaded.map(photo => {
      console.log(photo, 'photo');
      return photo.id.toString(); });
  }

  private setCategoryDefault(subCategory: SubcategoryInterface) {
    const options = this.categorySelectElem.nativeElement.options;
    const length = options.length;
    for (let index = 0; index < length; index++) {
      options[index].selected = options[index].value == subCategory.category.id;
      if (options[index].value == subCategory.category.id) {
        this.selectedComunity(subCategory.category.id as number);
        this.photosForm.controls["subcategory-id"].setValue(subCategory.id);
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

  private saveInitialPhotos(photos){
    this.photosUploaded = [].concat(photos);
  }

  private removePhoto(id: number) {
    this.photosUploaded = this.photosUploaded.filter(photo => photo.id != id);
  }

  private defineSubastaTimes(){
    this.minDate = moment().format('YYYY-MM-DD');
    this.maxDate = moment().add(30, 'days').format('YYYY-MM-DD');
  }

  get formIsInValid() {
    return this.photosForm.invalid || this.photosUploaded.length <= 0 ;
  }
}
