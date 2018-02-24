import { ProductsService } from './../../services/products.service';
import { SubcategoryInterface } from './../../commons/interfaces/subcategory.interface';
import { CategoriesService } from './../../services/categories.service';
import { CategoryInterface } from './../../commons/interfaces/category.interface';
import { PhotosService } from './../../services/photos.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES } from '../../router/routes';

@Component({
	selector: 'roducts-upload',
	templateUrl: './products-upload.page.html',
	styleUrls: ['./products-upload.page.scss']
})
export class ProductsUploadPage implements OnInit {
	photosForm: FormGroup;
	photosUploaded: Array<any> = [];
	categories: Array<CategoryInterface>= [];
	subCategories: Array<SubcategoryInterface> = [];
	constructor(
		private photosService: PhotosService,
		private categoryService:CategoriesService,
		private productsService:ProductsService,
		private router: Router) { }

	ngOnInit() {
		this.photosForm = new FormGroup({
			name: new FormControl('',[Validators.required]),
			price: new FormControl('',[Validators.required]),
			currency: new FormControl('COP',[Validators.required]),
			'subcategory-id': new FormControl('Escoge una subcategoria*',[Validators.required]),
			used: new FormControl('Estado del articulo*',[Validators.required]),
			visible: new FormControl('¿Quién puede verlo?',[Validators.required]),
			'sell-type': new FormControl('Tipo de venta*',[Validators.required]),
			description: new FormControl('',[Validators.required]),
			negotiable: new FormControl('',[])
		})
		this.categoryService.getCategories().then( (categorias:any) => this.categories = categorias);
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

	async publishPhoto(form){
		try {
			const photosIds = { 'photo-ids': this.getPhotosIds()};
			const publishDate = {
				'publish-until': this.getPublishUntilDate(),
				'published-at': new Date()
			}
			const params = Object.assign({}, this.photosForm.value, photosIds, publishDate);
			const response = await this.productsService.saveProducts(params);
			this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`]);
		} catch (error) {
			console.error("Error: ",error);
		}
	}

	selectedComunity(ev){
		const idCategory = ev.target.value;
		this.subCategories = this.findCategory(idCategory).subcategories;
	}

	private getPhotosIds():Array<string>{
		return this.photosUploaded.map( photo => photo.id.toString());
	}

	private findCategory(id:number){
		return this.categories.find( (category:CategoryInterface) => category.id == id);
	}

	private removePhoto(id:number){
		this.photosUploaded = this.photosUploaded.filter( photo => photo.id != id);
	}

	private cleanArrayPhotos(){
		this.photosUploaded = this.photosUploaded.map ( photo => { return {id: photo.id, url: photo.url} });
	}

	private getPublishUntilDate(): Date{
		/** El 30 debe ser congifurable DEUDA TECNICA */
		var date = new Date();
		date.setDate(date.getDate() + 30);
		return date;
	}

	private findPhoto(file:File){
		return this.photosUploaded.find( photo => {
					return photo.file == file;
				});
			}

	get photosUrlService(){
		return this.photosService.getUrlPhotos();
	}

	get formIsInValid(){
		return this.photosForm.invalid;
	}

}
