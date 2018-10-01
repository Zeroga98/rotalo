import { Component, OnInit } from "@angular/core";
import { CAROUSEL_COMPANY_CONFIG } from "./carouselCompany.config";
import { NgxCarousel } from "ngx-carousel";
import { IMGS_COMPANIES, IMGS_COMPANIES_MOBILE } from "../../commons/constants/images-companies";

@Component({
  selector: "company-slider",
  templateUrl: "./company-slider.component.html",
  styleUrls: ["./company-slider.component.scss"]
})
export class CompanySliderComponent implements OnInit {
  public carouselCompanyConfig: NgxCarousel;
  public imgCompaniesGroup;
  public imgCompanies;
  public imgCompaniesGroupMobile;
  public imgCompaniesMobile;
  constructor() {
    this.carouselCompanyConfig = CAROUSEL_COMPANY_CONFIG;
  }

  ngOnInit() {
    const imgCompanies = IMGS_COMPANIES ;
    const imgCompaniesMobile = IMGS_COMPANIES_MOBILE;
    this.imgCompaniesGroup = imgCompanies;
    this.imgCompaniesGroupMobile = imgCompaniesMobile;
    this.imgCompanies = this.chunkArray(this.imgCompaniesGroup, 4);
    this.imgCompaniesMobile = this.chunkArray(this.imgCompaniesGroupMobile, 2);

  }

  chunkArray(myArray, chunk_size) {
    const results = [];
    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }
    return results;
  }
}
