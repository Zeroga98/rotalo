import { LoansService } from './../../services/loans.service';
import { EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { ModalInterface } from '../../commons/interfaces/modal.interface';
import { StatesRequestEnum } from '../../commons/states-request.enum';

@Component({
	selector: 'sufi-modal',
	templateUrl: './sufi-te-presta-modal.component.html',
	styleUrls: ['./sufi-te-presta-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SufiTePrestaModalComponent implements OnInit {
	@Input() config: ModalInterface;
	@Output() close: EventEmitter<any> = new EventEmitter();
	title: string = "Créditos Sufi";
	statesRequestEnum = StatesRequestEnum; 
	stateRequest: StatesRequestEnum = this.statesRequestEnum.initial;

	constructor(
		private loansService: LoansService,
		private changeDetectorRef: ChangeDetectorRef) { }

	ngOnInit() {
	}

	closeModal() {
		this.close.emit();
	}

	async loanWithSufi(){
		try {
			this.stateRequest = this.statesRequestEnum.loading;
			const response = await this.loansService.loanWithSufi(this.config.price);
			this.stateRequest = StatesRequestEnum.success;
			this.changeDetectorRef.markForCheck();
		} catch (error) {
			this.stateRequest = this.statesRequestEnum.error;
			this.changeDetectorRef.markForCheck();
		}
	}
}
