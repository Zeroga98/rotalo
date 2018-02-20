import { ProductInterface } from './../../commons/interfaces/product.interface';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
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
    public products: Array<ProductInterface> = [];
    @ViewChild('backTop', {read: ElementRef}) backTop: ElementRef;

    constructor(private productsService: ProductsService, private rendered: Renderer2 ) {
        this.carouselConfig = CAROUSEL_CONFIG;
        this.imagesBanner = IMGS_BANNER;
    }

    ngOnInit() {
        const params = this.getParamsToProducts();
        this.loadProducts(params);
        this.setScrollEvent();
    }

    loadProducts(params:Object = {}){
        this.productsService.getProducts(params).subscribe(product => this.products.push(product));
    }

    getParamsToProducts(): Object {
        const params = {
            'filter[status]': 'active',
            'filter[country]': 1
        };
        return params;
    }

    private setScrollEvent(){
        window.addEventListener('scroll', this.backTopToggle.bind(this));
    }

    private backTopToggle(ev){
        const doc = document.documentElement;
        const offsetScrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        offsetScrollTop > 50 ? this.rendered.addClass(this.backTop.nativeElement, 'show') :
         this.rendered.removeClass(this.backTop.nativeElement, 'show') ;
    }
}
