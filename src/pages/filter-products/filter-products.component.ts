import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NavigationTopService } from '../../components/navigation-top/navigation-top.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { NavigationService } from '../products/navigation.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { noob } from './constanteMouk';

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
  public filter = noob;
  public products;
  constructor(private navigationTopService: NavigationTopService,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private changeDetectorRef: ChangeDetectorRef,
    private navigationService: NavigationService,
    private currentSession: CurrentSessionService,
    private router: Router) { }

  ngOnInit() {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      this.params = params;
      let countryId;
      if (this.navigationService.getCurrentCountryId()) {
        countryId = this.navigationService.getCurrentCountryId();
      } else {
        countryId = this.currentSession.currentUser()['countryId'];
      }
      console.log(noob);
      this.products = noob.body.productos;
      this.categorySubscription();
    });
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.navigationTopService.setCategory(undefined);
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
      console.log(this.categories);
      this.category = this.categories.filter(x => x.id == this.params['product_category_id']);
      this.category = this.category[0];
      this.category.subCategory = {};
      if (this.params['product_subcategory_id']) {
        const subcategory = this.category.subcategories.filter(x => x.id == this.params['product_subcategory_id']);
        this.category.subCategory = subcategory[0];
      }
      console.log(this.category);
      this.changeDetectorRef.markForCheck();
    }, (error) => {
      console.log(error);
    });
  }

}
