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

  categories: CategoryInterface;

  constructor(
    private categoriesService: CategoriesService,
    private changeDetectorRef: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      this.categories  = await this.categoriesService.getCategories();
      this.changeDetectorRef.markForCheck();
    } catch (error) {

    }
  }

  selectCategory(category: CategoryInterface) {
    this.categorySelected.emit(category);
  }

  selectSubCategory(subCategory: SubcategoryInterface, category: CategoryInterface) {
    subCategory.category = category;
    this.subCategorySelected.emit(subCategory);
  }
}
