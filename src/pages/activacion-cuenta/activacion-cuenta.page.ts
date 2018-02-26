import { ROUTES } from './../../router/routes';
import { Router } from '@angular/router';
import { CurrentSessionService } from './../../services/current-session.service';
import { ActivationService } from './../../services/activation.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-activacion-cuenta',
	templateUrl: './activacion-cuenta.page.html',
	styleUrls: ['./activacion-cuenta.page.scss']
})
export class ActivacionCuentaPage implements OnInit {
	errorRequest: Array<string> = [];

	constructor(
		private router: Router,
		private activationService: ActivationService,
		private currenSession: CurrentSessionService) { }

	ngOnInit() { }

	async activate(evt) {
		try {
			const response = await this.activationService.ejecuteActivation(evt.value.field);
			const userInfo = Object.assign({}, response.attributes, {'id': response.id});
			this.routineActivateSuccess(userInfo);
		} catch (error) {
			this.errorRequest = error.error.errors;
		}
	}

	private routineActivateSuccess(userInfo){
		this.errorRequest = [];
		this.currenSession.setSession(userInfo);
		this.router.navigate([ROUTES.SUCCESS]);
	}
}
