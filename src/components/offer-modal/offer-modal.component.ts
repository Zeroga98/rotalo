import { OfferService } from './../../services/offer.service';
import { ModalInterface } from './../../commons/interfaces/modal.interface';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

@Component({
	selector: 'offer-modal',
	templateUrl: './offer-modal.component.html',
	styleUrls: ['./offer-modal.component.scss']
})
export class OfferModalComponent implements OnInit {
	@ViewChild('priceInput', {read: ElementRef}) priceInput:ElementRef;
	@Input() config: ModalInterface;
	title: string = "¿Cuánto quieres ofertar?";
	isReadyResponse: boolean = false;

	constructor(private offerService:OfferService) { }

	ngOnInit() {
	}

	async sendOffer() {
		const price = this.priceInput.nativeElement.value;
		try {
			const response = await this.offerService.sendOffer({
				amount: price,
				'product-id': this.config['product-id']
			});
			console.log("Response: ", response);
			this.routineSuccess();
		} catch (error) {
			
		}
	}

	private routineSuccess(){
		this.isReadyResponse = true;
	}

	get isPriceCorrect():boolean{
		return this.priceInput && this.priceInput.nativeElement.value != '';
	}
}
