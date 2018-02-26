import { Component, OnInit, Input } from '@angular/core';
import { ModalInterface } from '../../commons/interfaces/modal.interface';

@Component({
  selector: 'sufi-modal',
  templateUrl: './sufi-te-presta-modal.component.html',
  styleUrls: ['./sufi-te-presta-modal.component.scss']
})
export class SufiTePrestaModalComponent implements OnInit {
  @Input() config: ModalInterface;
  
  title:string = "Créditos Sufi";
  constructor() { }

  ngOnInit() {
  }

}
