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


  public maxPrice;
  public minPrice;
  public countryId;
  public buttonNameFilter: String;
  public showFilterResponsive: boolean = true;

  public otherFilter = {
    vehicle_airbag: false,
    vehicle_abs_brakes: false,
    vehicle_air_conditioner: false,
    vehicle_unique_owner: false
  };

  public otherFilterImmovable = {
    immovable_elevator: false,
    immovable_parking: false,
    immovable_childis_games: false,
    immovable_useful_room: false,
    immovable_pool: false,
    immovable_full_furnished: false
  };

  public orderBy: string[] = [
    'Más reciente', 'Más antiguo', 'Menor precio', 'Mayor precio'
  ];

  public selected = this.orderBy[0];


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
      this.getCategories();
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

  }

  public filterOrder(filtro) {
    console.log(filtro);
    if (filtro === 'Más reciente') {
      console.log(1);
    }
    if (filtro === 'Más antiguo') {
      console.log(2);
    }
    if (filtro === 'Menor precio') {
      console.log(3);
    }
    if (filtro === 'Mayor precio') {
      console.log(4);
    }
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
        this.filter = this.productsService.filter;
        this.currentFilter = this.productsService.currentFilter;
        this.otherFilter = this.productsService.carObject.otherFilter;
        this.otherFilterImmovable = this.productsService.immovableObject.otherFilterImmovable;
        if (this.productsService.carObject.minPrice) { this.minPrice = this.productsService.carObject.minPrice; }
        if (this.productsService.carObject.maxPrice) { this.maxPrice = this.productsService.carObject.maxPrice; }
        this.totalPages = this.productsService.getTotalProductsFilters();
        this.changeDetectorRef.markForCheck();
      } else {
        let responseFilter: any;
        responseFilter = await this.productsService.loadProductsFilter(params);
        this.products = responseFilter.productos;
        Object.keys(responseFilter.filtros).forEach((key) => (responseFilter.filtros[key] == null) && delete responseFilter.filtros[key]);
        this.filter = Object.assign({}, this.filter , responseFilter.filtros);
        this.totalPages = this.productsService.getTotalProductsFilters();
        this.changeDetectorRef.markForCheck();
      }

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
        if (
          !this.navigationTopService.getCategory() ||
          (this.navigationTopService.getCategory() &&
            this.navigationTopService.getCategory() != event)
        ) {
          this.navigationTopService.setCategory(event);
          this.changeDetectorRef.markForCheck();
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

        if (this.params['product_category_id']) {
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
        } else  {

          if (this.params['product_subcategory_id']) {
            this.category = this.categories.filter(
              category => {
                for (var i = 0; i < category.subcategories.length; i++) {
                  if (category.subcategories[i].id == this.params['product_subcategory_id']) {
                    return category;
                  }
                }

              }
            );
            this.category = this.category[0];
            const subcategory = this.category.subcategories.filter(
              x => x.id == this.params['product_subcategory_id']
            );
            this.category.subCategory = subcategory[0];
          }
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
    this.scrollToTop();
  }

  public filteBySellType(sellType: string) {
    this.routineUpdateProducts({
      product_sell_type: sellType.toUpperCase(),
      number: 1
    });
    this.scrollToTop();
  }

  public filterByState(state: string) {
    this.routineUpdateProducts({ product_state_id: state, number: 1 });
    this.scrollToTop();
  }

  public filterByCity(city: string) {
    this.routineUpdateProducts({ product_city_id: city, number: 1 });
    this.scrollToTop();
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
      this.scrollToTop();
    } else {
      if (this.maxPrice) {
        this.routineUpdateProducts({
          product_price: `<=${this.maxPrice}`,
          number: 1
        });
        this.scrollToTop();
      } else if (this.minPrice) {
        this.routineUpdateProducts({
          product_price: `>=${this.minPrice}`,
          number: 1
        });
        this.scrollToTop();
      }
    }
  }

  public filterByBrand(brand: string) {
    this.routineUpdateProducts({ vehicle_brand_id: brand, number: 1 });
    this.scrollToTop();
  }

  public filterByModel(model: string) {
    this.routineUpdateProducts({ vehicle_line_id: model, number: 1 });
    this.scrollToTop();
  }

  public returnStringOption(option) {
    if (option) {
      option = `'${option}'`;
    }
    return option;
  }

  public filterByYear(year: string) {
    year = this.returnStringOption(year);
    this.routineUpdateProducts({ vehicle_model: year, number: 1 });
    this.scrollToTop();
  }

  public filterByColor(color: string) {
    color = this.returnStringOption(color);
    this.routineUpdateProducts({ vehicle_color: color, number: 1 });
    this.scrollToTop();
  }

  public filterByTransmission(transmission: string) {
    transmission = this.returnStringOption(transmission);
    this.routineUpdateProducts({
      vehicle_transmission: transmission,
      number: 1
    });
    this.scrollToTop();
  }

  public filterByGas(gas: string) {
    gas = this.returnStringOption(gas);
    this.routineUpdateProducts({ vehicle_gas: gas, number: 1 });
    this.scrollToTop();
  }

  public filterByLicensePlate(licensePlate: string) {
    licensePlate = this.returnStringOption(licensePlate);
    this.routineUpdateProducts({
      vehicle_license_plate: licensePlate,
      number: 1
    });
    this.scrollToTop();
  }

  public filterByUseType(useType: string) {
    useType = this.returnStringOption(useType);
    this.routineUpdateProducts({ vehicle_use_type: useType, number: 1 });
    this.scrollToTop();
  }

  public filterByTypeSeat(typeSeat: string) {
    typeSeat = this.returnStringOption(typeSeat);
    this.routineUpdateProducts({ vehicle_type_of_seat: typeSeat, number: 1 });
    this.scrollToTop();
  }

  public filterByMileage(operacionLogica, mileage: string) {
    if(mileage) {
      mileage = mileage.split('.').join('');
      if (operacionLogica != '-') {
        mileage = operacionLogica + mileage;
      }
    }
    this.routineUpdateProducts({ vehicle_mileage: mileage, number: 1 });
    this.scrollToTop();
  }

  public filterByDisplacement(displacement: string) {
    displacement = this.returnStringOption(displacement);
    this.routineUpdateProducts({ vehicle_displacement: displacement, number: 1 });
    this.scrollToTop();
  }

  public checkKilometers(operacionLogica , kilometer){
    kilometer = kilometer.split('.').join('');
    if (operacionLogica != '-') {
      kilometer = operacionLogica + kilometer;
    }
    if(this.currentFilter && this.currentFilter['vehicle_mileage'] == kilometer){
      return true;
    }
    return false;
  }

  public filterByOthersVehicle(other) {
    other = Object.assign(other, { number: 1 });
    this.routineUpdateProducts(other);
  }


  public filterByAntiquity(antiquity: string) {
    antiquity = this.returnStringOption(antiquity);
    this.routineUpdateProducts({ immovable_antiquity: antiquity, number: 1 });
    this.scrollToTop();
  }

  public filterByImmovable(immovable: string) {
    this.routineUpdateProducts({ immovable_floor: immovable, number: 1 });
    this.scrollToTop();
  }

  public filterBySellerType(sellerType: string) {
    sellerType = this.returnStringOption(sellerType);
    this.routineUpdateProducts({ immovable_seller_type: sellerType, number: 1 });
    this.scrollToTop();
  }

  public filterByRoom(room: string) {
    room = this.returnStringOption(room);
    this.routineUpdateProducts({ immovable_rooms: room, number: 1 });
    this.scrollToTop();
  }

  public filterByBathRoom(bathroom: string) {
    this.routineUpdateProducts({ immovable_bathrooms: bathroom, number: 1 });
    this.scrollToTop();
  }

  public filterBySocialClass(socialclass: string) {
    this.routineUpdateProducts({ immovable_social_class: socialclass, number: 1 });
    this.scrollToTop();
  }

  public filterBySquaremeters(squaremeter: string) {
    this.routineUpdateProducts({ immovable_square_meters: squaremeter, number: 1 });
    this.scrollToTop();
  }

  public filterByQuotaAdmin(quota: string) {
    this.routineUpdateProducts({ immovable_canon_quota: quota, number: 1 });
    this.scrollToTop();
  }

  public filterByGuardHouse(guard: string) {
    guard = this.returnStringOption(guard);
    this.routineUpdateProducts({ immovable_guard_house: guard, number: 1 });
    this.scrollToTop();
  }

  public filterByOthersImmovable(other) {
    other = Object.assign(other, { number: 1 });
    this.routineUpdateProducts(other);
  }

  public filterByGender(genderId) {
    this.routineUpdateProducts({ fashion_gender_id: genderId, number: 1 });
    this.scrollToTop();
  }

  public filterBySizeClothes(sizeId) {
    this.routineUpdateProducts({ fashion_size_id: sizeId, number: 1 });
    this.scrollToTop();
  }

  public filterByColorClothes(color: string) {
    color = this.returnStringOption(color);
    this.routineUpdateProducts({ fashion_color: color, number: 1 });
    this.scrollToTop();
  }

  public filterBySubCategoryClothes(subcategoryId) {
    this.routineUpdateProducts({ product_subcategory_id: subcategoryId, number: 1 });
    this.scrollToTop();
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

    this.otherFilterImmovable = {
      immovable_elevator: false,
      immovable_parking: false,
      immovable_childis_games: false,
      immovable_useful_room: false,
      immovable_pool: false,
      immovable_full_furnished: false
    };

    this.minPrice = null;
    this.maxPrice = null;
    this.currentFilter = Object.assign({}, this.currentFilter, this.params);
    this.filterService.setCurrentFilter(null);
    this.routineUpdateProducts(this.currentFilter);
    this.scrollToTop();
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
    const carObject =
    {
      otherFilter: this.otherFilter,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    };

    const immovableObject = {
      otherFilterImmovable: this.otherFilterImmovable
    };

    this.productsService.setProductLocationFilter(immovableObject , carObject ,
      this.currentFilter,
      this.filter,
      this.products,
      event['product_id'],
      this.currentPage);
  }
}
