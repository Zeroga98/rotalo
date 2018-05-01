import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'show-star',
  templateUrl: './show-star.component.html',
  styleUrls: ['./show-star.component.scss']
})
export class ShowStarComponent implements OnInit {
  @Input() numberStar ;
  constructor() { }

  ngOnInit() {
  }

}
