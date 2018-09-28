import { Component, OnInit } from "@angular/core";
import { CAROUSEL_COMPANY_CONFIG } from "./carouselCompany.config";
import { NgxCarousel } from "ngx-carousel";
import { IMGS_COMPANIES } from "../../commons/constants/images-companies";

@Component({
  selector: "company-slider",
  templateUrl: "./company-slider.component.html",
  styleUrls: ["./company-slider.component.scss"]
})
export class CompanySliderComponent implements OnInit {
  public carouselCompanyConfig: NgxCarousel;
  public imgCompaniesGroup = IMGS_COMPANIES;
  public imgCompanies;
  constructor() {
    this.carouselCompanyConfig = CAROUSEL_COMPANY_CONFIG;
  }

  ngOnInit() {
    this.imgCompanies = this.chunkArray(this.imgCompaniesGroup, 4);
  }

  chunkArray(myArray, chunk_size) {
    const results = [];
    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }
    return results;
  }
}
