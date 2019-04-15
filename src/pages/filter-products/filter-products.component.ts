import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NavigationTopService } from '../../components/navigation-top/navigation-top.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { NavigationService } from '../products/navigation.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { ROUTES } from '../../router/routes';
import { ProductInterface } from '../../commons/interfaces/product.interface';
import { FilterService } from './filter.service';
import { UtilsService } from '../../util/utils.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'filter-products',
  templateUrl: './filter-products.component.html',
  styleUrls: ['./filter-products.component.scss']
})
export class FilterProductsComponent implements OnInit, OnDestroy, AfterViewInit {
  public category;
  public sub;
  public categories;
  public params;
  public filter;
  public products;
  private currentFilter: Object;
  private currentPage: number = 1;
  public  showPagination = false;
  public pageNumber: number = 1;
  public totalPages: number = 100;
  public communitiesFilter;
  public sellTypesFilter;
  public stateFilter;
  public cityFilter;
  public maxPrice;
  public minPrice;

  constructor(private navigationTopService: NavigationTopService,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private changeDetectorRef: ChangeDetectorRef,
    private navigationService: NavigationService,
    private currentSession: CurrentSessionService,
    private router: Router,
    private utilService: UtilsService,
    private filterService: FilterService,
    private productsService: ProductsService) {
      this.currentFilter = this.filterService.getCurrentFilter();
    }

  ngOnInit() {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      this.params = params;
      console.log(this.params);
      let countryId;
      if (this.navigationService.getCurrentCountryId()) {
        countryId = this.navigationService.getCurrentCountryId();
      } else {
        countryId = this.currentSession.currentUser()['countryId'];
      }
      this.loadProductsFilter(countryId);
      this.categorySubscription();
    });
  }

  ngAfterViewInit() {
    this.showPagination = true;
  }

  ngOnDestroy() {
    this.navigationTopService.setCategory(undefined);
  }

  loadProductsFilter(countryId) {
    this.currentFilter = {
      'product_country_id' : countryId,
      'size': 24,
      'number': 1
    };
    this.currentFilter = Object.assign({}, this.currentFilter, this.params);
    this.filterService.setCurrentFilter(this.currentFilter);
    const params = this.getParamsToProducts();
    this.loadProducts(params);
  }

  async loadProducts(params: Object = {}) {
    try {
      if (this.productsService.products.length > 0) {
        this.products = this.productsService.products;
        this.currentPage = this.productsService.currentPage;
        this.pageNumber = this.currentPage;
        this.changeDetectorRef.markForCheck();
      } else {

        let responseFilter: any;
        responseFilter = await this.productsService.loadProductsFilter(params);
        this.products = responseFilter.productos;
        this.filter = responseFilter.filtros;
        if (this.filter.filtroComunidad && this.filter.filtroComunidad.comunidades) {
          this.communitiesFilter  = this.filter.filtroComunidad;
        }
        if (this.filter.filtroTipoVenta && this.filter.filtroTipoVenta.tiposVentas) { this.sellTypesFilter =  this.filter.filtroTipoVenta; }
        if (this.filter.filtroDepartamento && this.filter.filtroDepartamento.departamentos)
        {this.stateFilter = this.filter.filtroDepartamento; }
        if (this.filter.filtroCiudad && this.filter.filtroCiudad.ciudades) {this.cityFilter = this.filter.filtroCiudad; }
       // this.updateProducts(products);
      }
      this.totalPages = this.productsService.getTotalProductsFilters();
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      this.changeDetectorRef.markForCheck();
    }

    if (this.products && this.products.length <= 0) {
     // this.showAnyProductsMessage = true;
    } else {
     // this.showAnyProductsMessage = false;
    }
    this.changeDetectorRef.markForCheck();
  }

  getParamsToProducts() {
    return this.currentFilter;
  }

  categorySubscription() {
    this.navigationTopService.currentEventCategory.subscribe(event => {
      if (event) {
        this.category = event;
        if (!this.navigationTopService.getCategory()
        || this.navigationTopService.getCategory()
        && this.navigationTopService.getCategory() != event) {
          this.navigationTopService.setCategory(event);
        }
      } else  {
        this.getCategories();
      }
    });
  }

  getCategories() {
    this.categoriesService.getCategoriesActiveServer().subscribe((response) => {
      this.categories = response;
      this.category = this.categories.filter(x => x.id == this.params['product_category_id']);
      this.category = this.category[0];
      this.category.subCategory = {};
      if (this.params['product_subcategory_id']) {
        const subcategory = this.category.subcategories.filter(x => x.id == this.params['product_subcategory_id']);
        this.category.subCategory = subcategory[0];
      }
      this.changeDetectorRef.markForCheck();
    }, (error) => {
      console.log(error);
    });
  }

  selectProduct(product: ProductInterface) {
    const routeDetailProduct = `${ROUTES.PRODUCTS.LINK}/${
      ROUTES.PRODUCTS.SHOW
      }/${product['product_id']}`;
    this.router.navigate([routeDetailProduct]);
  }

  private routineUpdateProducts(filter: Object = {}, numberPage = 1) {
    filter = Object.assign({}, filter, this.getPageFilter(numberPage));
    const newFilter = this.updateCurrentFilter(filter);
    this.loadProducts(newFilter);
  }

  private getPageFilter(numberPage = 1) {
    this.currentPage = numberPage;
    return { 'number': numberPage };
  }

  private updateCurrentFilter(filter = {}) {
    this.currentFilter = Object.assign({}, this.currentFilter, filter);
    this.currentFilter = this.utilService.removeEmptyValues(this.currentFilter);
    this.filterService.setCurrentFilter(this.currentFilter);
    return this.currentFilter;
  }

  public  getPage(page: number) {
    this.pageNumber = page;
    this.routineUpdateProducts(
      { 'number': page },
      page
    );
    this.productsService.scroll = 0;
    window.scrollTo(0, 0);
  }



  public filteByCommunity(community: string) {
    this.routineUpdateProducts({ 'seller_community_id': community , 'number': 1});
  }

  public filteBySellType(sellType: string) {
    this.routineUpdateProducts({ 'product_sell_type': sellType.toUpperCase() , 'number': 1});
  }

  public filterByState(state: string) {
    this.routineUpdateProducts({ 'product_state_id': state , 'number': 1});
  }

  public filterByCity(city: string) {
    this.routineUpdateProducts({ 'product_city_id': city , 'number': 1});
  }

  public filterByMinMax() {
    if (this.maxPrice && this.minPrice) {
      if (+this.maxPrice < +this.minPrice) {
        const auxPrice = this.maxPrice;
        this.maxPrice = this.minPrice;
        this.minPrice = auxPrice;
      }
      this.routineUpdateProducts({ 'product_price': `${this.minPrice}-${this.maxPrice}`, 'number': 1 });
    } else {
      if (this.maxPrice) {
        this.routineUpdateProducts({ 'product_price': `<=${this.maxPrice}`, 'number': 1 });
      } else if (this.minPrice) {
        this.routineUpdateProducts({ 'product_price': `>=${this.minPrice}` , 'number': 1});
      }
    }
  }

}
