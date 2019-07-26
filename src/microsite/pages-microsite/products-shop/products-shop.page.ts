import { OnInit, ChangeDetectorRef } from '@angular/core';
import { CurrentSessionService } from '../../../services/current-session.service';
import { CountryInterface } from '../../../components/select-country/country.interface';
import { ROUTES } from '../../../router/routes';
import { Router } from '@angular/router';
import { Component, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'products-shop',
  templateUrl: './products-shop.page.html',
  styleUrls: ['./products-shop.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsHomePage implements OnInit {
  defaultCountry: CountryInterface;

  constructor(
    public router: Router,
    private _changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this._changeDetector.markForCheck();
  }


/*  get isHideBackArrow() {
    return (
      this.router.url === `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
    );
  } */
}
