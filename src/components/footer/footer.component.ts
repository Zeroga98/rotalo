import { Router } from '@angular/router';
import { ROUTES } from './../../router/routes';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'custom-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  public readonly termsLink: string = `/${ROUTES.TERMS}`;
  private readonly _homeRoute: string = `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`;
  
  constructor(private _router:Router) { }

  ngOnInit() {
  }

  goToHome(){
    this._router.navigate([this._homeRoute]);
  }

}
