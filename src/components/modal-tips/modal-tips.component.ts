import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'modal-tips',
  templateUrl: './modal-tips.component.html',
  styleUrls: ['./modal-tips.component.scss']
})
export class ModalTipsComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  closeModal() {
    this.close.emit();
  }
}
