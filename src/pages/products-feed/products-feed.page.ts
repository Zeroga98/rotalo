import { CityInterface } from './../../commons/interfaces/city.interface';
import { NavigationService } from './../products/navigation.service';
import { Router } from '@angular/router';
import { SubcategoryInterface } from './../../commons/interfaces/subcategory.interface';
import { CategoryInterface } from './../../commons/interfaces/category.interface';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ElementRef, ViewChild, Renderer2, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { ProductsService } from '../../services/products.service';
import { IMGS_BANNER } from '../../commons/constants/banner-imgs.contants';
import { CAROUSEL_CONFIG } from './carousel.config';
import { ROUTES } from './../../router/routes';
import { Subscription } from 'rxjs';
import { StatesRequestEnum } from '../../commons/states-request.enum';
import { UtilsService } from '../../util/utils.service';


@Component({
  selector: "products-feed",
  templateUrl: "products-feed.page.html",
  styleUrls: ["products-feed.page.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsFeedPage implements OnInit, OnDestroy {

  public carouselConfig: NgxCarousel;
  public imagesBanner: Array<string>;
  public products: Array<ProductInterface> = [];
  public configFiltersSubcategory: Object;
  private _subscriptionCountryChanges: Subscription;
  private currentPage: number = 1;
  private waitNewPage: boolean = false;
  statesRequestEnum = StatesRequestEnum;
	stateRequest: StatesRequestEnum = this.statesRequestEnum.initial;
  private currentFilter: Object = {
    "filter[status]": "active",
    "filter[country]": 1,
    "filter[community]": -1,
    "page[size]": 8,
    "page[number]": 1
  };
  @ViewChild("backTop", { read: ElementRef })
  backTop: ElementRef;

  constructor(
    private productsService: ProductsService,
    private rendered: Renderer2,
    private router: Router,
    private utilService: UtilsService,
    private navigationService: NavigationService,
    private changeDetectorRef:ChangeDetectorRef
  ) {
    this.carouselConfig = CAROUSEL_CONFIG;
    this.imagesBanner = IMGS_BANNER;
  }

  ngOnInit() {
    const params = this.getParamsToProducts();
    this.loadProducts(params);
    this._subscribeCountryChanges();
    this.setScrollEvent();
  }

  ngOnDestroy(): void {
    this._subscriptionCountryChanges.unsubscribe();
  }

  async loadProducts(params: Object = {}) {
    try {
      this.stateRequest = this.statesRequestEnum.loading;
      const products = await this.productsService.getProducts(params);
      this.stateRequest = this.statesRequestEnum.success;
      this.updateProducts(this.filterNoVisibleProducts(products));
      console.log("products: ", this.products);
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      this.stateRequest = this.statesRequestEnum.error;
    }
  }

  getParamsToProducts() {
    return this.currentFilter;
  }

  searchByTags(evt: Array<string>) {
    const filterValue = evt.join("+");
    this.routineUpdateProducts({ "filter[search]": filterValue });
  }

  filteBySellType(sellType: string){
    this.routineUpdateProducts({"filter[sell_type]": sellType.toUpperCase()});
  }

  filterBySort(sort: string){
    this.routineUpdateProducts({sort});
  }

  filterByState(state){
    this.routineUpdateProducts({"filter[state]": state.id});
  }

  filterByCity(city: CityInterface){
    this.routineUpdateProducts({"filter[city]": city.id, "filter[state]": undefined});
  }

  scrolledInfinite(){
    this.currentPage++;
    this.waitNewPage = true;
    this.routineUpdateProducts({"page[number]":this.currentPage});
  }

  changeCommunity(community: any) {
    this.routineUpdateProducts({ "filter[community]": community.id });
  }

  selectedCategory(category: CategoryInterface) {
    this.configFiltersSubcategory = {category: category.name,subCategory: undefined};
    this.routineUpdateProducts({
      "filter[category]": category.id,
      "filter[subcategory_id]": undefined
    });
  }

  selectProduct(product: ProductInterface) {
    const routeDetailProduct = `${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.SHOW
    }/${product.id}`;
    this.router.navigate([routeDetailProduct]);
  }

  selectedSubCategory(subCategory: SubcategoryInterface) {
    this.configFiltersSubcategory = {category: subCategory.category.name, subCategory: subCategory.name};
    this.routineUpdateProducts({
      "filter[subcategory_id]": subCategory.id,
      "filter[category]": undefined
    });
  }

  get isSpinnerShow(): boolean {
    return this.stateRequest == this.statesRequestEnum.loading;
  }

  get noExistProducts(): boolean {
    return this.products.length <= 0;
  }

  private _subscribeCountryChanges(){
    this._subscriptionCountryChanges = this.navigationService.countryChanged.subscribe( (country:any) => this.routineUpdateProducts({ "filter[country]": country.id }));
  }

  private updateProducts(newProducts: Array<ProductInterface>){
    this.waitNewPage ? this.addNewPage(newProducts) : this.products = [].concat(newProducts);
    this.waitNewPage = false;
  }

  addNewPage(newProducts){
    newProducts.forEach( product => this.products.push(product));
  }

  private routineUpdateProducts(filter: Object) {
    const newFilter = this.updateCurrentFilter(filter);
    this.loadProducts(newFilter);
  }
  private updateCurrentFilter(filter = {}) {
    this.currentFilter = Object.assign({}, this.currentFilter, filter);
    this.currentFilter = this.utilService.removeEmptyValues(this.currentFilter);
    return this.currentFilter;
  }

  private setScrollEvent() {
    window.addEventListener("scroll", this.backTopToggle.bind(this));
  }

  private filterNoVisibleProducts(products: Array<any>) {
    return products.filter((product: ProductInterface) => product.visible);
  }

  private backTopToggle(ev) {
    const doc = document.documentElement;
    const offsetScrollTop =
      (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    offsetScrollTop > 50
      ? this.rendered.addClass(this.backTop.nativeElement, "show")
      : this.rendered.removeClass(this.backTop.nativeElement, "show");
  }
}
