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
	msgRequest: string = 'Su calificación ha sido enviada';
	statesRequestEnum = StatesRequestEnum;
	stateRequest: StatesRequestEnum = this.statesRequestEnum.initial;
	private _rating: number = 0;
	private _comment: string = '';

	constructor(private ratingService: RatingService, private changeDetectorRef: ChangeDetectorRef) { }

	ngOnInit() {
	}

	async ratePurchase() {
		try {
			this.stateRequest = this.statesRequestEnum.loading;
			const response = await this.ratingService.rate(this._rating, this._comment, this.config['purchase-id']);
			this.stateRequest = StatesRequestEnum.success;
			this.msgRequest = "Su calificación ha sido enviada";
			this.changeDetectorRef.markForCheck();
		} catch (error) {
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
