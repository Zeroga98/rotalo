import { EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
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
  @ViewChild('priceInput', { read: ElementRef }) priceInput: ElementRef;
  @Input() config: ModalInterface;
  @Output() close: EventEmitter<any> = new EventEmitter();
  title: string = '¿Cuánto quieres ofertar?';
  errorInForm: boolean = false;
  msgError: string = '';
  isReadyResponse: boolean = false;
  minValue: number;

  @HostListener('document:click', ['$event']) clickout(event) {
    if (event.target && event.target.className) {
      if (event.target.className == 'opacity') {
        this.closeModal();
      }
    }
    this.changeDetectorRef.markForCheck();
  }


  constructor(
    private offerService: OfferService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.minValue = this.config.price as number + (this.config.price as number * 0.05);
  }

  async sendOffer() {
    const price = this.priceInput.nativeElement.value;
    if (this.validForm(price)) {
      try {
        const response = await this.offerService.sendOffer({
          monto: price,
          idProducto: this.config['product-id']
        });
        this.routineSuccess();
        this.changeDetectorRef.markForCheck();
      } catch (error) {}
    }
  }

  validForm(price: number): boolean {
    if (price.toString() == '' || price == null) {
      this.setErrorForm(true, 'Debes ingresar una oferta');
      return false;
    }
    if (this.config.type === 'SUBASTA') {
      if (price < this.minValue) {
        this.setErrorForm(true, `La oferta debe ser mayor o igual a ${this.minValue}`);
        return false;
      }
    }
    this.setErrorForm(false);
    this.changeDetectorRef.markForCheck();
    return true;
  }

  setErrorForm(isError: boolean, msg: string = '') {
    this.errorInForm = isError;
    this.msgError = msg;
    this.changeDetectorRef.markForCheck();
  }

  closeModal() {
    this.close.emit();
  }

  private routineSuccess() {
    this.isReadyResponse = true;
  }

 /* get isPriceCorrect(): boolean {
    //return (this.priceInput || this.priceInput.nativeElement.value !== ''  ? true : false);
  }*/
}
