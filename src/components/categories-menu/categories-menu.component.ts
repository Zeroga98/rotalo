import { CategoriesService } from "./../../services/categories.service";
import { SubcategoryInterface } from "./../../commons/interfaces/subcategory.interface";
import { CategoryInterface } from "./../../commons/interfaces/category.interface";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "categories-menu",
  templateUrl: "./categories-menu.component.html",
  styleUrls: ["./categories-menu.component.scss"]
})
export class CategoriesMenuComponent implements OnInit {
  @Output()
  categorySelected: EventEmitter<CategoryInterface> = new EventEmitter();
  @Output()
  subCategorySelected: EventEmitter<SubcategoryInterface> = new EventEmitter();

  categories: CategoryInterface;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.categoriesService
      .getCategories()
      .then(response => (this.categories = response));
  }

  selectCategory(category: CategoryInterface) {
    this.categorySelected.emit(category);
  }

  selectSubCategory(subCategory: SubcategoryInterface) {
    this.subCategorySelected.emit(subCategory);
  }
}
