import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'custom-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() title:string = "Mensajes";
  
  constructor() { }

  ngOnInit() { }

}
