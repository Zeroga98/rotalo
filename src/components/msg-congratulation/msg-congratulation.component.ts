import { ROUTES } from './../../router/routes';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'msg-congratulation',
  templateUrl: './msg-congratulation.component.html',
  styleUrls: ['./msg-congratulation.component.scss']
})
export class MsgCongratulationComponent implements OnInit {
  routeHome:string = ROUTES.HOME
  constructor() { }

  ngOnInit() {
  }

}
