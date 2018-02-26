import { ProductsService } from './../../services/products.service';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BuyService } from '../../services/buy.service';

@Component({
	selector: 'buy-product',
	templateUrl: './buy-product.page.html',
	styleUrls: ['./buy-product.page.scss']
})
export class BuyProductPage implements OnInit {
	@ViewChild('selectMedium', {read: ElementRef}) selectMedium: ElementRef;
	idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ''));
	transactionSuccess: boolean = false;
	product: ProductInterface;

	constructor(
		private router: Router,
		private productsService:ProductsService,
		private buyService:BuyService 
	) { }

	ngOnInit() {
		this.loadProduct();
	}

	async loadProduct(){
		try {
			this.product = await this.productsService.getProductsById(this.idProduct);
		} catch (error) {
			
		}
	}

	async buyProduct(){
		try {
			const response  = await this.buyService.buyProduct(this.buildParams());
			console.log(response);
			this.transactionSuccess = true;
		} catch (error) {
			
		}
	}

	private buildParams(){
		return {
			'product-id': this.idProduct,
          	'payment-type': this.selectMedium.nativeElement.value
		}
	}

}