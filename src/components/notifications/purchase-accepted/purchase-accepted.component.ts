import { ROUTES } from './../../../router/routes';
import { Router } from '@angular/router';
import { NotificationsInterface } from './../../../commons/interfaces/notifications.interface';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ProductsService } from '../../../services/products.service';

@Component({
	selector: 'purchase-accepted',
	templateUrl: './purchase-accepted.component.html',
	styleUrls: ['./purchase-accepted.component.scss']
})
export class PurchaseAcceptedComponent {
	@Input() notification;
	@Output() userClicked: EventEmitter<any> = new EventEmitter();
	@Output() onContactSeller: EventEmitter<any> = new EventEmitter();
	constructor(private productsService: ProductsService, private router: Router) { }

	async productReceived(id: number){
		try {
			const response = await this.productsService.receiveProduct(id,{id});
			this.notification.status = 'Has recibido el producto';
		} catch (error) {
			console.error(error);
			alert('Ha ocurrido un error: ' + error.error.errors[0]);
		}
	}

	clickUser(){
		this.userClicked.emit();
	}

	goToDetail(id: number){
		this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${id}`]);
	}

	contactSeller(id: number){
		this.onContactSeller.emit(id);
	}

}
