import { OnInit, ChangeDetectorRef } from '@angular/core';
import { CurrentSessionService } from './../../services/current-session.service';
import { CountryInterface } from './../../components/select-country/country.interface';
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
export class ProductsPage implements OnInit {
	
	defaultCountry: CountryInterface;

	constructor(
		private navigationService: NavigationService, 
		public router:Router,
		private _changeDetector: ChangeDetectorRef,
		private currentSession: CurrentSessionService) { 	
	}

	ngOnInit(): void {
		this._changeDetector.markForCheck();
	}

	onCountryChanged(evt) {
		this.navigationService.setCountry(evt);
	}

	get isHideBackArrow(){
		return this.router.url === `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`;
	}

}
