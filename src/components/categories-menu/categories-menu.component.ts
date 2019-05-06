import { CategoriesService } from './../../services/categories.service';
import { SubcategoryInterface } from './../../commons/interfaces/subcategory.interface';
import { CategoryInterface } from './../../commons/interfaces/category.interface';
import { Component, OnInit, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from './../../router/routes';
import { NavigationTopService } from '../navigation-top/navigation-top.service';
import { ProductsService } from './../../services/products.service';

@Component({
  selector: 'categories-menu',
  templateUrl: './categories-menu.component.html',
  styleUrls: ['./categories-menu.component.scss']
})
export class CategoriesMenuComponent implements OnInit {
  @Output() categorySelected: EventEmitter<CategoryInterface> = new EventEmitter();
  @Output() subCategorySelected: EventEmitter<SubcategoryInterface> = new EventEmitter();
  @Output() closeMenu = new EventEmitter();

  categories: any;

  constructor(
    private router: Router,
    private navigationTopService: NavigationTopService,
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.categoriesService.getCategoriesActive()) {
      this.categories = this.categoriesService.getCategoriesActive();
    } else {
      this.categoriesService.getCategoriesActiveServer().subscribe((response) => {
        this.categories = response;
        this.categoriesService.setCategoriesActive(this.categories);
      }, (error) => {
        console.log(error);
      });
    }
    this.changeDetectorRef.markForCheck();
    this.clickCloseMenu();
  }

  selectCategory(category: any, subCategory: any) {
    if (category.productsActives != 0 || subCategory && subCategory.productsActives &&  subCategory.productsActives != 0) {
      this.clickCloseMenu();
      category.subCategory = subCategory;
      this.navigationTopService.changeCategory(category);
      if (category.subCategory && category.subCategory.id) {
        this.router.navigate([
          `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FILTERS}`
        ], {queryParams: {product_category_id : category.id, product_subcategory_id: category.subCategory.id}});
      } else  {
        this.router.navigate([
          `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FILTERS}`
        ], {queryParams: {product_category_id : category.id}});
      }
    }
    this.productsService.productsFilter = [];
    this.productsService.currentPageFilter = 1;
  }

  selectSubCategory(subCategory: any, category: any ) {
    if (subCategory.productsActives != 0) {
      subCategory.category = category;
      this.clickCloseMenu();
      this.navigationTopService.changeSubCategory(subCategory);
      this.router.navigate([
        `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FILTERS}`
      ]);
    }
  }

  clickCloseMenu() {
    this.closeMenu.emit();
  }

  hideCloseButton() {
    if (this.router.url == '/products/categories') {
      return true;
    }
    return false;
  }


}
