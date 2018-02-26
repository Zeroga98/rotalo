import { Component, OnInit, ElementRef } from '@angular/core';
import { CAROUSEL_CONFIG } from './carousel.config';
import { NgxCarousel } from 'ngx-carousel';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import { ProductsService } from '../../services/products.service';
import { ROUTES } from '../../router/routes';
import { Router } from '@angular/router';
import { ModalInterface } from '../../commons/interfaces/modal.interface';
import { ConversationInterface } from '../../commons/interfaces/conversation.interface';

@Component({
	selector: 'detalle-producto',
	templateUrl: './detalle-producto.component.html',
	styleUrls: ['./detalle-producto.component.scss']
})
export class DetalleProductoComponent implements OnInit {
	public carouselConfig: NgxCarousel;
	public products: Array<ProductInterface> = [];
	public productsPhotos: any;
	configModal: ModalInterface;
	isSufiModalShowed :boolean = false;
	isOfferModalShowed: boolean = false;

	idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ''));

	constructor(private productsService: ProductsService, private router: Router) {
		this.carouselConfig = CAROUSEL_CONFIG;
	}

	ngOnInit() {
		this.loadProduct();
	}

	loadProduct() {
		this.productsService.getProductsById(this.idProduct).then(prod => {
			this.products = [].concat(prod);
			if (typeof this.products[0].photos != undefined) {
				this.productsPhotos = [].concat(this.products[0].photos);
				this.products[0].photos = this.productsPhotos;
			}
		});
	}

	isSpinnerShow(): boolean {
		return this.products.length > 0;
	}

	validateSession() {
		//poner id del usuario logueado
		return this.products[0].user.id == "3061" && this.products[0].status === 'active';
	}

	async deleteProduct(product: ProductInterface){
		try {
			const result = confirm("¿Seguro quieres borrar esta publicación?")
			if(!result) return;
			const response = await this.productsService.deleteProduct(product.id);
			this.router.navigate([`${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`]);
		} catch (error) {
			
		}
	}

	editProduct(product: ProductInterface){
		this.router.navigate([`${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.UPLOAD}/${product.id}`]);
	}

	getLocation(product): string {
		const city = product.user.city;
		const state = city.state;
		return `${city.name}, ${state.name}`;
	}

	buyProduct(id: number | string){
		const urlBuyProduct = `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.BUY}/${id}`;
		this.router.navigate([urlBuyProduct]);
	}

	openSufiModal(product:ProductInterface){
		this.isSufiModalShowed = true;
		this.configurarModal(product);
	}

	openOfferModal(product:ProductInterface){
		this.isOfferModalShowed = true;
		this.configurarModal(product);
	}

	private configurarModal(product:ProductInterface){
		this.configModal = {
			photo: product.photos[0].url,
			title: product.name,
			price: product.price,
			'product-id': product.id
		}
	}

}
