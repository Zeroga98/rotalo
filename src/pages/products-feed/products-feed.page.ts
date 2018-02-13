import {Component, OnInit} from '@angular/core';
import {NgxCarousel} from 'ngx-carousel';
@Component({selector: 'products-feed', templateUrl: 'products-feed.page.html', styleUrls: ['products-feed.page.scss']})
export class ProductsFeedPage implements OnInit {
    public carouselConfig: NgxCarousel;
    public imagesBanner: Array<string>;
    ngOnInit() {
        this.carouselConfig = {
            grid: {
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
                all: 0
            },
            slide: 1,
            speed: 400,
            interval: 4000,
            point: {
                visible: false
            },
            load: 2,
            touch: true,
            loop: true,
            custom: 'banner'
        };

        this.imagesBanner = [
            './assets/img/banner/banner_1.png',
            './assets/img/banner/banner_2.png',
            './assets/img/banner/banner_3.png'
        ];
    }
}
