import { ProductInterface } from './../../commons/interfaces/product.interface';
import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent {
	@Input() product: ProductInterface;
	@Output() selected: EventEmitter<ProductInterface> = new EventEmitter();
	private readonly defaultImage: string = './assets/img/product-no-image.png';

	constructor() {
	}

	getLocation(product): string {
		const city = product.user.city;
		const state = city.state;
		return `${city.name}, ${state.name}`;
	}

	selectProduct() {
		this.selected.emit(this.product);
	}

	updateSrc(evt) {
		evt.currentTarget.src = this.defaultImage;
	}

}
