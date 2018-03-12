import { NotificationsInterface } from './../../../commons/interfaces/notifications.interface';
import { Component, OnInit, Output, Input } from '@angular/core';
import { ProductsService } from '../../../services/products.service';

@Component({
	selector: 'purchase-accepted',
	templateUrl: './purchase-accepted.component.html',
	styleUrls: ['./purchase-accepted.component.scss']
})
export class PurchaseAcceptedComponent {
	@Input() notification: NotificationsInterface;
	
	constructor(private productsService: ProductsService) { }
	
	async productReceived(id: number){
		try {
			const response = await this.productsService.receiveProduct(id,{id});
			this.notification.status = 'Has recibido el producto';
			console.log(response);
		} catch (error) {
			console.log(error);
			alert('Ha ocurrido un error: ' + error.error.errors[0]);
		}
	}

}
