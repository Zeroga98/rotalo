import { Component, OnInit } from "@angular/core";
import { CAROUSEL_COMPANY_CONFIG } from "./carouselCompany.config";
import { NgxCarousel } from "ngx-carousel";
import { IMGS_COMPANIES, IMGS_COMPANIES_MOBILE, IMGS_COMPANIES_GUATEMALA, IMGS_COMPANIES_MOBILE_GUATEMALA } from "../../commons/constants/images-companies";

@Component({
  selector: "company-slider",
  templateUrl: "./company-slider.component.html",
  styleUrls: ["./company-slider.component.scss"]
})
export class CompanySliderComponent implements OnInit {
  public carouselCompanyConfig: NgxCarousel;
  public imgCompaniesGroup;
  public imgCompanies = IMGS_COMPANIES;
  public imgCompaniesGroupMobile;
  public imgCompaniesMobile = IMGS_COMPANIES_MOBILE;
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
      this.imgCompaniesMobile = IMGS_COMPANIES_MOBILE_GUATEMALA;
    } else {
      this.imgCompanies = IMGS_COMPANIES;
      this.imgCompaniesMobile = IMGS_COMPANIES_MOBILE;
    }
  }

}
