import { ProductInterface } from './../../commons/interfaces/product.interface';
import { EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CategoryInterface } from '../../commons/interfaces/category.interface';
import { SubcategoryInterface } from '../../commons/interfaces/subcategory.interface';
import { PhotosService } from '../../services/photos.service';
import { CategoriesService } from '../../services/categories.service';

@Component({
	selector: 'form-product',
	templateUrl: './form-product.component.html',
	styleUrls: ['./form-product.component.scss']
})
export class FormProductComponent implements OnInit, OnChanges {
	
	@Input() product: ProductInterface;
	@Output() submit: EventEmitter<any> = new EventEmitter();
	photosForm: FormGroup;
	photosUploaded: Array<any> = [];
	categories: Array<CategoryInterface>= [];
	subCategories: Array<SubcategoryInterface> = [];
	
	constructor(
		private photosService: PhotosService,
		private categoryService:CategoriesService) { }

	ngOnInit() {
		this.setInitialForm(this.getInitialConfig());
		this.categoryService.getCategories().then( (categorias:any) => this.categories = categorias);
	}

	ngOnChanges(): void {
		this.setInitialForm(this.getInitialConfig())
	}

	async publishPhoto(form){
		const photosIds = { 'photo-ids': this.getPhotosIds()};
		const publishDate = {
			'publish-until': this.getPublishUntilDate(),
			'published-at': new Date()
		}
		const params = Object.assign({}, this.photosForm.value, photosIds, publishDate);
		this.submit.emit(params);
	}

	async onUploadImageFinished(event){
		try {
			const response = await this.photosService.updatePhoto(event.file);
			const photo = Object.assign({}, response, { 'file': event.file });
			this.photosUploaded.push(photo);
		} catch (error) {
			console.error("Error: ",error);
		}
	}

	async onRemoveImage(event){
		try {
			const photo = this.findPhoto(event.file);
			const response =  await this.photosService.deletePhotoById(photo.id);
			this.removePhoto(photo.id);
		} catch (error) {
			console.error("error: ", error);
		}
	}

	selectedComunity(ev){
		const idCategory = ev.target.value;
		this.subCategories = this.findCategory(idCategory).subcategories;
	}

	private setInitialForm(config:ProductInterface){
		this.photosForm = new FormGroup({
			name: new FormControl(config.name,[Validators.required]),
			price: new FormControl(config.price,[Validators.required]),
			currency: new FormControl(config.currency,[Validators.required]),
			'subcategory-id': new FormControl(config['subcategory-id'],[Validators.required]),
			used: new FormControl(config.used,[Validators.required]),
			visible: new FormControl(config.visible,[Validators.required]),
			'sell-type': new FormControl(config['sell-type'],[Validators.required]),
			description: new FormControl(config.description,[Validators.required]),
			negotiable: new FormControl(config.negotiable,[])
		});
	}

	private getInitialConfig():ProductInterface{
		const product: ProductInterface = {
			name: '',
			price: '',
			currency: 'COP',
			'subcategory-id':'Escoge una subcategoria*',
			used:'Estado del articulo*',
			visible:'¿Quién puede verlo?',
			'sell-type':'Tipo de venta*',
			description:'',
			negotiable: '',
		};
		return Object.assign({}, product, this.product) as ProductInterface;
	}

	private getPhotosIds():Array<string>{
		return this.photosUploaded.map( photo => photo.id.toString());
	}

	private findCategory(id:number){
		return this.categories.find( (category:CategoryInterface) => category.id == id);
	}

	private getPublishUntilDate(): Date{
		/** El 30 debe ser congifurable DEUDA TECNICA */
		var date = new Date();
		date.setDate(date.getDate() + 30);
		return date;
	}

	private cleanArrayPhotos(){
		this.photosUploaded = this.photosUploaded.map ( photo => { return {id: photo.id, url: photo.url} });
	}

	private findPhoto(file:File){
		return this.photosUploaded.find( photo => {
					return photo.file == file;
				});
	}

	private removePhoto(id:number){
		this.photosUploaded = this.photosUploaded.filter( photo => photo.id != id);
	}

	get formIsInValid(){
		return this.photosForm.invalid;
	}

}
