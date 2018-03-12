import { EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { OfferService } from './../../services/offer.service';
import { ModalInterface } from './../../commons/interfaces/modal.interface';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

@Component({
	selector: 'offer-modal',
	templateUrl: './offer-modal.component.html',
	styleUrls: ['./offer-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferModalComponent implements OnInit {
	@ViewChild('priceInput', {read: ElementRef}) priceInput:ElementRef;
	@Input() config: ModalInterface;
	@Output() close: EventEmitter<any> = new EventEmitter();
	title: string = "¿Cuánto quieres ofertar?";
	isReadyResponse: boolean = false;

	constructor(
		private offerService:OfferService,
		private changeDetectorRef: ChangeDetectorRef) { }

	ngOnInit() {
	}

	async sendOffer() {
		const price = this.priceInput.nativeElement.value;
		try {
			const response = await this.offerService.sendOffer({
				amount: price,
				'product-id': this.config['product-id']
			});
			this.routineSuccess();
			this.changeDetectorRef.markForCheck();
		} catch (error) {

		}
	}

	closeModal(){
		this.close.emit();
	}

	private routineSuccess(){
		this.isReadyResponse = true;
	}

	get isPriceCorrect():boolean{
		return this.priceInput && this.priceInput.nativeElement.value != '';
	}
}
