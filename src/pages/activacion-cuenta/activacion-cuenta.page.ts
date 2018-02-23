import { ActivationService } from './../../services/activation.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-activacion-cuenta',
	templateUrl: './activacion-cuenta.page.html',
	styleUrls: ['./activacion-cuenta.page.scss']
})
export class ActivacionCuentaPage implements OnInit {

	constructor(private activationService: ActivationService) { }

	ngOnInit() { }

	async activate(evt) {
		try {
			const response = await this.activationService.ejecuteActivation(evt.value.field);
		} catch (error) {

		}
	}
}
