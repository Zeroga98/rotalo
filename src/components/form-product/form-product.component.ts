import { PhotoInterface } from './../../commons/interfaces/photo.interface';
import { ProductInterface } from "./../../commons/interfaces/product.interface";
import { EventEmitter, Output, Input, OnChanges, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { CategoryInterface } from "../../commons/interfaces/category.interface";
import { SubcategoryInterface } from "../../commons/interfaces/subcategory.interface";
import { PhotosService } from "../../services/photos.service";
import { CategoriesService } from "../../services/categories.service";

@Component({
  selector: "form-product",
  templateUrl: "./form-product.component.html",
  styleUrls: ["./form-product.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormProductComponent implements OnInit, OnChanges {
  @Input() product: ProductInterface;
  @Output() publish: EventEmitter<any> = new EventEmitter();
  @ViewChild("categorySelect", { read: ElementRef })
  categorySelectElem: ElementRef;
  photosForm: FormGroup;
  photosUploaded: Array<any> = [];
  categories: Array<CategoryInterface> = [];
  subCategories: Array<SubcategoryInterface> = [];
  subCategory: SubcategoryInterface;
  modelsVehicle: Array<any> = [];
  vehicleProperties: Array<any> = ["Particular", "Público"];
  currentSubcategory: String = "";
  constructor(
    private photosService: PhotosService,
    private categoryService: CategoriesService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
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
          this.saveInitialPhotos(this.product.photos);
          this.setCategoryDefault(this.product.subcategory);
          clearInterval(interval);
        }
      }, 20);
    }
  }

  async publishPhoto(form) {
    const photosIds = { "photo-ids": this.getPhotosIds() };
    const publishDate = {
      "publish-until": this.getPublishUntilDate(),
      "published-at": new Date()
    };
    const params = Object.assign({}, this.photosForm.value, photosIds, publishDate);
    this.publish.emit(params);
  }

  async onUploadImageFinished(event) {
    try {
      const response = await this.photosService.updatePhoto(event.file);
      const photo = Object.assign({}, response, { file: event.file });
      this.photosUploaded.push(photo);
      console.log("photos: ",this.photosUploaded);
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  async onRemoveImage(file) {
    const photo = this.findPhoto(file);
    this.removeImageFromServer(photo.id);
  }

  async removeImageFromServer(id:number){
    try {
      const response = await this.photosService.deletePhotoById(id);
      this.removePhoto(id);
      console.log("photos: ", this.photosUploaded);
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

  subcategoryIsVehicle(): boolean {
    /**No quemar 'Carros' */
    return this.subCategory && this.subCategory.name === "Carros";
  }

  selectedComunity(idCategory: number) {
    this.subCategories = this.findCategory(idCategory).subcategories;
    console.log( this.subCategories);
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
    this.photosForm = new FormGroup({
      name: new FormControl(config.name, [Validators.required]),
      price: new FormControl(config.price, [Validators.required]),
      currency: new FormControl(config.currency, [Validators.required]),
      "subcategory-id": new FormControl(config["subcategory-id"], [
        Validators.required
      ]),
      used: new FormControl(config.used, [Validators.required]),
      visible: new FormControl(config.visible, [Validators.required]),
      "sell-type": new FormControl(config["sell-type"], [Validators.required]),
      description: new FormControl(config.description, [Validators.required]),
      negotiable: new FormControl(config.negotiable, []),
      "type-vehicle": new FormControl('', []),
      "model": new FormControl('', []),
    });
  }

  private getInitialConfig(): ProductInterface {
    const product: ProductInterface = {
      name: "",
      price: "",
      currency: "COP",
      "subcategory-id": "Escoge una subcategoria*",
      used: "Estado del articulo*",
      visible: "¿Quién puede verlo?",
      "sell-type": "Tipo de venta*",
      description: "",
      negotiable: true
    };
    return Object.assign({}, product, this.product) as ProductInterface;
  }

  private getPhotosIds(): Array<string> {
    return this.photosUploaded.map(photo => photo.id.toString());
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

  get formIsInValid() {
    return this.photosForm.invalid && this.photosUploaded.length > 0 ;
  }
}
