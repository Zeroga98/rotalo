import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'success-credit',
  templateUrl: './success-credit.component.html',
  styleUrls: ['./success-credit.component.scss']
})
export class SuccessCreditComponent implements OnInit {


    @Output() closeModal = new EventEmitter();
    public productPhoto: any;

    ngOnInit() {
    }

    constructor(
    ) {}

    closeModalBuy() {
      this.closeModal.emit();
    }

}
