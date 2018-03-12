import { ROUTES } from './../../router/routes';
import { Router } from '@angular/router';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavigationService } from './navigation.service';

@Component({
	selector: 'products-home',
	templateUrl: './products.page.html',
	styleUrls: ['./products.page.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsPage {
	constructor(private navigationServce: NavigationService, public router:Router) { }

	onCountryChanged(evt) {
		this.navigationServce.setCountry(evt);
	}

	get isHideBackArrow(){
		return this.router.url === `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`;
	}

}
