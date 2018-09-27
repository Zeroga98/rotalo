import { CategoriesService } from "./../../services/categories.service";
import { SubcategoryInterface } from "./../../commons/interfaces/subcategory.interface";
import { CategoryInterface } from "./../../commons/interfaces/category.interface";
import { Component, OnInit, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "categories-menu",
  templateUrl: "./categories-menu.component.html",
  styleUrls: ["./categories-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesMenuComponent implements OnInit {
  @Output()categorySelected: EventEmitter<CategoryInterface> = new EventEmitter();
  @Output()subCategorySelected: EventEmitter<SubcategoryInterface> = new EventEmitter();

  categories: any;

  constructor(
    private categoriesService: CategoriesService,
    private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.categoriesService.getCategoriesActive()) {
      this.categories = this.categoriesService.getCategoriesActive();
      this.changeDetectorRef.markForCheck();
    } else {
      this.categoriesService.getCategoriesActiveServer().subscribe((response) => {
        this.categories = response;
        this.categoriesService.setCategoriesActive(this.categories);
        this.changeDetectorRef.markForCheck();
      }, (error) => {
        console.log(error);
      });
    }
  }

  selectCategory(category: any) {
    if (category.productsActives != 0) {
      this.categorySelected.emit(category);
    }
  }

  selectSubCategory(subCategory: any, category: any) {
    if (subCategory.productsActives != 0) {
      subCategory.category = category;
      this.subCategorySelected.emit(subCategory);
    }
  }
}
