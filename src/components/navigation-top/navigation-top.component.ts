import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'navigation-top',
  templateUrl: './navigation-top.component.html',
  styleUrls: ['./navigation-top.component.scss']
})
export class NavigationTopComponent implements OnInit {
  @Output() countryChanged : EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  changeSelectorCounrty(evt){
    this.countryChanged.emit(evt);
  }

}
