import { Component, OnInit } from '@angular/core';
import { CAROUSEL_COMPANY_CONFIG } from './carouselCompany.config';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  selector: 'company-slider',
  templateUrl: './company-slider.component.html',
  styleUrls: ['./company-slider.component.scss']
})
export class CompanySliderComponent implements OnInit {
  public carouselCompanyConfig: NgxCarousel;
  constructor() {
    this.carouselCompanyConfig = CAROUSEL_COMPANY_CONFIG;
   }

  ngOnInit() {
  }

}
