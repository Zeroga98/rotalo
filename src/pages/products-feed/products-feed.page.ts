import {Component, OnInit} from '@angular/core';
import {NgxCarousel} from 'ngx-carousel';
import { ProductsService } from '../../services/products.service';
import { IMGS_BANNER } from '../../commons/constants/banner-imgs.contants';
import { CAROUSEL_CONFIG } from './carousel.config';
@Component({
    selector: 'products-feed',
    templateUrl: 'products-feed.page.html',
    styleUrls: ['products-feed.page.scss']
})

export class ProductsFeedPage implements OnInit {
    public carouselConfig: NgxCarousel;
    public imagesBanner: Array<string>;

    constructor(private productsService:ProductsService ){
        this.carouselConfig = CAROUSEL_CONFIG;
        this.imagesBanner = IMGS_BANNER;
    }

    ngOnInit() {
        const params = this.getParamsToProducts();
        this.loadProducts(params);
    }

    async loadProducts(params:Object = {}){
        try {
            const response = await this.productsService.getProducts(params);
            console.log(response);
        } catch (error) {
            console.log("error: ",error);
        }
    }

    getParamsToProducts():Object{
        let params ={
            'filter[status]': 'active',
            'filter[country]': 1
        }
        return params;
    }
}
