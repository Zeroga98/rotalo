import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';

@Component({
  selector: 'modal-tips',
  templateUrl: './modal-tips.component.html',
  styleUrls: ['./modal-tips.component.scss']
})
export class ModalTipsComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();


  @HostListener('document:click', ['$event']) clickout(event) {
    if (event.target && event.target.className) {
      if (event.target.className == 'opacity') {
        this.closeModal();
      }
    }
  }
  constructor() { }

  ngOnInit() {
  }
  closeModal() {
    this.close.emit();
  }
}
