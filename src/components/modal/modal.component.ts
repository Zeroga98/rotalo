import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'custom-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() title:string = "Mensajes";
  @Output() close: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() { }

  showOcult() {
    console.log("close");
    this.close.emit();
  }
}
