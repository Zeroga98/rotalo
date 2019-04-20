import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChildren,
  QueryList
} from '@angular/core';
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
import { noob } from './constanteMouk';

@Component({
  selector: 'filter-products',
  templateUrl: './filter-products.component.html',
  styleUrls: ['./filter-products.component.scss']
})
export class FilterProductsComponent
  implements OnInit, OnDestroy, AfterViewInit {
  public category;
  public sub;
  public categories;
  public params;
  public filter;
  public products;
  public currentFilter: Object;
  private currentPage: number = 1;
  public showPagination = false;
  public pageNumber: number = 1;
  public totalPages: number = 100;
  public communitiesFilter;
  public sellTypesFilter;
  public stateFilter;
  public cityFilter;
  public maxPrice;
  public minPrice;
  public countryId;
  public buttonNameFilter: String;
  public showFilterResponsive: boolean = true;
  public brandFilter;
  public modelFilter;
  public yearFilter;
  public colorFilter;
  public transmissionFilter;
  public gasFilter;
  public licensePlateFilter;
  public useTypeFilter;
  public typeSeatFilter;
  public mileageFilter;
  public otherFilter = {
    vehicle_airbag: false,
    vehicle_abs_brakes: false,
    vehicle_air_conditioner: false,
    vehicle_unique_owner: false
  };
  @ViewChildren('productsEnd') endForRender: QueryList<any>;


  constructor(
    private navigationTopService: NavigationTopService,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private changeDetectorRef: ChangeDetectorRef,
    private navigationService: NavigationService,
    private currentSession: CurrentSessionService,
    private router: Router,
    private utilService: UtilsService,
    private filterService: FilterService,
    private productsService: ProductsService
  ) {
    this.currentFilter = this.filterService.getCurrentFilter();
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.params = params;
      if (this.navigationService.getCurrentCountryId()) {
        this.countryId = this.navigationService.getCurrentCountryId();
      } else {
        this.countryId = this.currentSession.currentUser()['countryId'];
      }
      this.loadProductsFilter(this.countryId);
      if (!this.params['product_name']) {
        this.categorySubscription();
      } else {
        this.category = null;
      }
    });

    this.showToFilter();
  }

  ngAfterViewInit() {
    this.showPagination = true;
    if (this.productsService.productsFilter.length > 0) {
      // this.endForRender.notifyOnChanges();
      this.endForRender.changes.subscribe(t => {
        this.ngForRender();
        this.changeDetectorRef.markForCheck();
      });
      this.endForRender.notifyOnChanges();
    }
    this.changeDetectorRef.markForCheck();
  }

  ngForRender() {
    this.productsService.productsFilter = [];
    this.productsService.getProductLocationFilter();
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy() {
    this.navigationTopService.setCategory(undefined);
  }

  loadProductsFilter(countryId) {
    this.currentFilter = {
      product_country_id: countryId,
      size: 24,
      number: 1
    };
    this.currentFilter = Object.assign({}, this.currentFilter, this.params);
    this.filterService.setCurrentFilter(this.currentFilter);
    const params = this.getParamsToProducts();
    this.loadProducts(params);
  }

  async loadProducts(params: Object = {}) {
    try {
      if (this.productsService.productsFilter.length > 0) {
        this.products = this.productsService.productsFilter;
        this.currentPage = this.productsService.currentPageFilter;
        this.pageNumber = this.currentPage;
        let responseFilter: any;
        responseFilter = await this.productsService.loadProductsFilter(params);
        this.filter = responseFilter.filtros;
        this.changeDetectorRef.markForCheck();
      } else {
        let responseFilter: any;
        responseFilter = await this.productsService.loadProductsFilter(params);
        this.products = responseFilter.productos;
        this.filter = responseFilter.filtros;
     /*   this.products = noob.body.productos;
        this.filter = noob.body.filtros;*/
        // this.updateProducts(products);
      }
      if (
        this.filter.filtroComunidad &&
        this.filter.filtroComunidad.comunidades
      ) {
        this.communitiesFilter = this.filter.filtroComunidad;
      }
      if (
        this.filter.filtroTipoVenta &&
        this.filter.filtroTipoVenta.tiposVentas
      ) {
        this.sellTypesFilter = this.filter.filtroTipoVenta;
      }
      if (
        this.filter.filtroDepartamento &&
        this.filter.filtroDepartamento.departamentos
      ) {
        this.stateFilter = this.filter.filtroDepartamento;
      }
      if (this.filter.filtroCiudad && this.filter.filtroCiudad.ciudades) {
        this.cityFilter = this.filter.filtroCiudad;
      }
      if (this.filter.filtroMarca && this.filter.filtroMarca.marcas) {
        this.brandFilter = this.filter.filtroMarca;
      }
      if (this.filter.filtroModelo && this.filter.filtroModelo.modelos) {
        this.modelFilter = this.filter.filtroModelo;
      }
      if (this.filter.filtroAnio && this.filter.filtroAnio.anios) {
        this.yearFilter = this.filter.filtroAnio;
      }
      if (this.filter.filtroColor && this.filter.filtroColor.colores) {
        this.colorFilter = this.filter.filtroColor;
      }
      if (
        this.filter.filtroTransmision &&
        this.filter.filtroTransmision.transmisiones
      ) {
        this.transmissionFilter = this.filter.filtroTransmision;
      }
      if (
        this.filter.filtroCombustible &&
        this.filter.filtroCombustible.combustibles
      ) {
        this.gasFilter = this.filter.filtroCombustible;
      }
      if (
        this.filter.filtroNumeroPlaca &&
        this.filter.filtroNumeroPlaca.numerosPlacas
      ) {
        this.licensePlateFilter = this.filter.filtroNumeroPlaca;
      }
      if (this.filter.filtroTipoUso && this.filter.filtroTipoUso.tiposUsos) {
        this.useTypeFilter = this.filter.filtroTipoUso;
      }
      if (
        this.filter.filtroTipoAsiento &&
        this.filter.filtroTipoAsiento.tiposAsientos
      ) {
        this.typeSeatFilter = this.filter.filtroTipoAsiento;
      }
      if (
        this.filter.filtroKilometraje &&
        this.filter.filtroKilometraje.kilometrajes
      ) {
        this.mileageFilter = this.filter.filtroKilometraje;
      }
      this.totalPages = this.productsService.getTotalProductsFilters();
      this.scrollToTop();
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      this.changeDetectorRef.markForCheck();
    }
  }

  getParamsToProducts() {
    return this.currentFilter;
  }

  categorySubscription() {
    this.navigationTopService.currentEventCategory.subscribe(event => {
      if (event) {
        this.category = event;
        this.brandFilter = null;
        this.modelFilter  = null;
        this.yearFilter = null;
        this.colorFilter = null;
        this.transmissionFilter = null;
        this.gasFilter = null;
        this.licensePlateFilter = null;
        this.useTypeFilter = null;
        this.typeSeatFilter = null;
        this.mileageFilter = null;
        this.otherFilter = {
          vehicle_airbag: false,
          vehicle_abs_brakes: false,
          vehicle_air_conditioner: false,
          vehicle_unique_owner: false
        };
      /*  this.productsService.productsFilter = [];
        this.productsService.currentPageFilter = 1;
        this.currentPage = this.productsService.currentPageFilter;
        this.pageNumber = this.currentPage;*/
        if (
          !this.navigationTopService.getCategory() ||
          (this.navigationTopService.getCategory() &&
            this.navigationTopService.getCategory() != event)
        ) {
          this.navigationTopService.setCategory(event);
        }
      } else {
        this.getCategories();
      }
    });
  }

  getCategories() {
    this.categoriesService.getCategoriesActiveServer().subscribe(
      response => {
        this.categories = response;
        this.category = this.categories.filter(
          x => x.id == this.params['product_category_id']
        );
        this.category = this.category[0];
        this.category.subCategory = {};
        if (this.params['product_subcategory_id']) {
          const subcategory = this.category.subcategories.filter(
            x => x.id == this.params['product_subcategory_id']
          );
          this.category.subCategory = subcategory[0];
        }
        this.changeDetectorRef.markForCheck();
      },
      error => {
        console.log(error);
      }
    );
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
    return { number: numberPage };
  }

  private updateCurrentFilter(filter = {}) {
    this.currentFilter = Object.assign({}, this.currentFilter, filter);
    this.currentFilter = this.utilService.removeEmptyValues(this.currentFilter);
    this.filterService.setCurrentFilter(this.currentFilter);
    return this.currentFilter;
  }

  public getPage(page: number) {
    this.pageNumber = page;
    this.routineUpdateProducts({ number: page }, page);
    this.scrollToTop();
  }

  public scrollToTop() {
    this.productsService.scroll = 0;
    window.scrollTo(0, 0);
  }

  public filteByCommunity(community: string) {
    this.routineUpdateProducts({ seller_community_id: community, number: 1 });
  }

  public filteBySellType(sellType: string) {
    this.routineUpdateProducts({
      product_sell_type: sellType.toUpperCase(),
      number: 1
    });
  }

  public filterByState(state: string) {
    this.routineUpdateProducts({ product_state_id: state, number: 1 });
  }

  public filterByCity(city: string) {
    this.routineUpdateProducts({ product_city_id: city, number: 1 });
  }

  public filterByMinMax() {
    if (this.maxPrice && this.minPrice) {
      if (+this.maxPrice < +this.minPrice) {
        const auxPrice = this.maxPrice;
        this.maxPrice = this.minPrice;
        this.minPrice = auxPrice;
      }
      this.routineUpdateProducts({
        product_price: `${this.minPrice}-${this.maxPrice}`,
        number: 1
      });
    } else {
      if (this.maxPrice) {
        this.routineUpdateProducts({
          product_price: `<=${this.maxPrice}`,
          number: 1
        });
      } else if (this.minPrice) {
        this.routineUpdateProducts({
          product_price: `>=${this.minPrice}`,
          number: 1
        });
      }
    }
  }

  public filterByBrand(brand: string) {
    this.routineUpdateProducts({ vehicle_brand_id: brand, number: 1 });
  }

  public filterByModel(model: string) {
    this.routineUpdateProducts({ vehicle_line_id: model, number: 1 });
  }

  public filterByYear(year: string) {
    if (year) {
      year = `'${year}'`;
    }
    this.routineUpdateProducts({ vehicle_model: year, number: 1 });
  }

  public filterByColor(color: string) {
    if (color) {
      color = `'${color}'`;
    }
    this.routineUpdateProducts({ vehicle_color: color, number: 1 });
  }

  public filterByTransmission(transmission: string) {
    if (transmission) {
      transmission = `'${transmission}'`;
    }
    this.routineUpdateProducts({
      vehicle_transmission: transmission,
      number: 1
    });
  }
  public filterByGas(gas: string) {
    if (gas) {
      gas = `'${gas}'`;
    }
    this.routineUpdateProducts({ vehicle_gas: gas, number: 1 });
  }
  public filterByLicensePlate(licensePlate: string) {
    if (licensePlate) {
      licensePlate = `'${licensePlate}'`;
    }
    this.routineUpdateProducts({
      vehicle_license_plate: licensePlate,
      number: 1
    });
  }
  public filterByUseType(useType: string) {
    if (useType) {
      useType = `'${useType}'`;
    }
    this.routineUpdateProducts({ vehicle_use_type: useType, number: 1 });
  }
  public filterByTypeSeat(typeSeat: string) {
    if (typeSeat) {
      typeSeat = `'${typeSeat}'`;
    }
    this.routineUpdateProducts({ vehicle_type_of_seat: typeSeat, number: 1 });
  }
  public filterByMileage(mileage: string) {
    mileage = mileage.replace('.', '');
    this.routineUpdateProducts({ vehicle_mileage: mileage, number: 1 });
  }
  public filterByOthersVehicle(other) {
    other = Object.assign(other, { number: 1 });
    this.routineUpdateProducts(other);
  }

  removeFilters() {
    this.currentFilter = {
      product_country_id: this.countryId,
      size: 24,
      number: 1
    };
    this.otherFilter = {
      vehicle_airbag: false,
      vehicle_abs_brakes: false,
      vehicle_air_conditioner: false,
      vehicle_unique_owner: false
    };
    this.minPrice = null;
    this.maxPrice = null;
    this.currentFilter = Object.assign({}, this.currentFilter, this.params);
    this.filterService.setCurrentFilter(null);
    this.routineUpdateProducts(this.currentFilter);
  }

  showToFilter() {
    this.showFilterResponsive =
      !this.buttonNameFilter || this.buttonNameFilter === 'Aplicar';
    this.buttonNameFilter =
      !this.buttonNameFilter || this.showFilterResponsive
        ? 'Filtros'
        : 'Aplicar';
  }

  setScroll(event) {
    this.productsService.setProductLocationFilter(this.products, event['product_id'], this.currentPage);
  }

}
