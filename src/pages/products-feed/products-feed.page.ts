import { Router } from '@angular/router';
import { SubcategoryInterface } from './../../commons/interfaces/subcategory.interface';
import { CategoryInterface } from './../../commons/interfaces/category.interface';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { ProductsService } from '../../services/products.service';
import { IMGS_BANNER } from '../../commons/constants/banner-imgs.contants';
import { CAROUSEL_CONFIG } from './carousel.config';
import { ROUTES } from './../../router/routes';

@Component({
    selector: 'products-feed',
    templateUrl: 'products-feed.page.html',
    styleUrls: ['products-feed.page.scss']
})

export class ProductsFeedPage implements OnInit{
    public carouselConfig: NgxCarousel;
    public imagesBanner: Array<string>;
    public products: Array<ProductInterface> = [];

    private currentFilter: any = {
        'filter[status]': 'active',
        'filter[country]': 1
    };
    @ViewChild('backTop', {read: ElementRef}) backTop: ElementRef;

    constructor(
        private productsService: ProductsService, 
        private rendered: Renderer2,
        private router: Router ) {
        this.carouselConfig = CAROUSEL_CONFIG;
        this.imagesBanner = IMGS_BANNER;
    }

    ngOnInit() {
        const params = this.getParamsToProducts();
        this.loadProducts(params);
        this.setScrollEvent();
    }

    async loadProducts(params:Object = {}) {
        try {
            const products = await this.productsService.getProducts(params)
            this.products = [].concat(this.filterNoVisibleProducts(products));
        } catch (error) {
            
        }
    }

    getParamsToProducts() {
        return this.currentFilter;
    }

    onCountryChanged(evt) {
        this.routineUpdateProducts({"filter[country]":evt.id});
    }

    searchByTags(evt:Array<string>) {
        const filterValue = evt.join("+");
        this.routineUpdateProducts({"filter[search]": filterValue});
    }

    changeCommunity(community:any){
        this.routineUpdateProducts({"filter[community]": community.id});
    }

    selectedCategory(category:CategoryInterface){
        this.routineUpdateProducts({
            "filter[category]": category.id,
            "filter[subcategory_id]": null
        });
    }

    selectProduct(product:ProductInterface){
        const routeDetailProduct = `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${product.id}`;
        this.router.navigate([routeDetailProduct]);
    }

    selectedSubCategory(subCategory: SubcategoryInterface){
        this.routineUpdateProducts({
            "filter[subcategory_id]": subCategory.id,
            "filter[category]": null,
        });
    }

    get isSpinnerShow(): boolean{
        return this.products.length <= 0;
    }

    private routineUpdateProducts(filter: Object){
        const newFilter = this.updateCurrentFilter(filter);
        this.loadProducts(newFilter);
    }
    private updateCurrentFilter(filter = {}) {
        this.currentFilter = Object.assign({}, this.currentFilter, filter);
        console.log('current: ', this.currentFilter);
        return this.currentFilter;
    }

    private setScrollEvent() {
        window.addEventListener('scroll', this.backTopToggle.bind(this));
    }

    private filterNoVisibleProducts(products: Array<any>){
        return products.filter( (product:ProductInterface) => product.visible)
    }

    private backTopToggle(ev) {
        const doc = document.documentElement;
        const offsetScrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        offsetScrollTop > 50 ? this.rendered.addClass(this.backTop.nativeElement, 'show') :
         this.rendered.removeClass(this.backTop.nativeElement, 'show') ;
    }
}
