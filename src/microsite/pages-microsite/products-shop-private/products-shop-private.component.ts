import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'products-shop-private',
  templateUrl: './products-shop-private.component.html',
  styleUrls: ['./products-shop-private.component.scss']
})
export class ProductsShopPrivateComponent implements OnInit {

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {
  }

}
