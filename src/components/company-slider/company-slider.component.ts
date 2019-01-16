import { Component, OnInit } from '@angular/core';
import { CAROUSEL_COMPANY_CONFIG } from './carouselCompany.config';
import { NgxCarousel } from 'ngx-carousel';
import { IMGS_COMPANIES, IMGS_COMPANIES_GUATEMALA } from '../../commons/constants/images-companies';

@Component({
  selector: 'company-slider',
  templateUrl: './company-slider.component.html',
  styleUrls: ['./company-slider.component.scss']
})
export class CompanySliderComponent implements OnInit {
  public carouselCompanyConfig: NgxCarousel;
  public imgCompanies = IMGS_COMPANIES;
  constructor() {
    this.carouselCompanyConfig = CAROUSEL_COMPANY_CONFIG;
  }

  ngOnInit() {
    this.checkIfIsColombia();
  }

  checkIfIsColombia() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('gt')) {
      this.imgCompanies = IMGS_COMPANIES_GUATEMALA;
    } else {
      this.imgCompanies = IMGS_COMPANIES;
    }
  }

}
