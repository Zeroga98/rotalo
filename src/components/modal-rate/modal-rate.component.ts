import { ChangeDetectorRef } from '@angular/core';
import { RatingService } from './../../services/rating.service';
import { ChangeDetectionStrategy, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { StatesRequestEnum } from '../../commons/states-request.enum';

@Component({
	selector: 'modal-rate',
	templateUrl: './modal-rate.component.html',
	styleUrls: ['./modal-rate.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalRateComponent implements OnInit {
	@Output() close: EventEmitter<any> = new EventEmitter();
	@Input() config;
	title: string = "Califica al vendedor";
	type: string = 'Comprador';
	msgRequest: string = 'Su calificación ha sido enviada';
	statesRequestEnum = StatesRequestEnum;
	stateRequest: StatesRequestEnum = this.statesRequestEnum.initial;
	comment: string = ''
	rateValue: number = 0;
	rateSent: boolean = false;
	userName: string = '';
	private _rating: number = 0;
	private _comment: string = '';

	constructor(private ratingService: RatingService, private changeDetectorRef: ChangeDetectorRef) { }

	ngOnInit() {
		if(this.config.type == 'rate_seller'){
			this.type = "Vendedor";
			this.userName = this.config.name;
			if (this.config.purchase['buyer-rate'] !== null) {
				this.rateSent = true;
				this.rateValue = this.config.purchase['buyer-rate'].value;
				this.comment = this.config.purchase['buyer-rate'].comment;
			}
		}else {
			this.type = 'Comprador';
			this.userName = this.config.purchase.user.name;
			if (this.config.purchase['seller-rate'] !== null) {
				this.rateSent = true;
				this.rateValue = this.config.purchase['seller-rate'].value;
				this.comment = this.config.purchase['seller-rate'].comment;
			}
		};
		this.title = `Califica al ${this.type}`;
	}

	async ratePurchase() {
		try {
			this.stateRequest = this.statesRequestEnum.loading;
			const response = await this.ratingService.rate(this._rating, this._comment, this.config['purchase-id']);
			this.stateRequest = StatesRequestEnum.success;
			this.msgRequest = "Su calificación ha sido enviada";
			this.changeDetectorRef.markForCheck();
		} catch (error) {
			console.error(error);
			this.stateRequest = StatesRequestEnum.error;
			this.msgRequest = error.data.messages;
			this.changeDetectorRef.markForCheck();
    	}
	}

	closeModal() {
		this.close.emit();
	}

	rate(evt: number){
		this._rating = evt;
	}

	onBlurText(event) {
    	this._comment = event.currentTarget.value;
  	}

	get isRateButtonAvailable() {
		return this._rating > 0 && this._comment != '';
	}

}
