import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ROUTES } from './../../router/routes';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CONFIG } from './steps.config';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  selector: "rotalo-steps",
  templateUrl: "./steps.page.html",
  styleUrls: ["./steps.page.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepsPage implements OnInit {
  steps: Array<any> = CONFIG.STEPS;
  carouselConfig: NgxCarousel;
  @ViewChild("nextCarousel", { read: ElementRef })
  nextCarouselElem: ElementRef;

  constructor(private router: Router, private changeRef: ChangeDetectorRef) {
    this.carouselConfig = CONFIG.CAROUSEL;
  }

  ngOnInit() {}

  skipSteps() {
    this.changeRef.markForCheck();
    this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`]);
  }

  continueSlide(index: number) {
    index == this.steps.length - 1 ? this.skipSteps() : this.nextSlide();
  }

  private nextSlide() {
    this.nextCarouselElem.nativeElement.click();
  }
}
