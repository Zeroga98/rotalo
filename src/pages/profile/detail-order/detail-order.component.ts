import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss']
})
export class DetailOrderComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    /*document.body.scrollTop = 0;
    document.querySelector('body').scrollTo(0,0)*/
  }

}
