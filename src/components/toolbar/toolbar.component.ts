import { SubcategoryInterface } from './../../commons/interfaces/subcategory.interface';
import { CategoryInterface } from './../../commons/interfaces/category.interface';
import { UserService } from './../../services/user.service';
import { Component, OnInit, EventEmitter, Output, ElementRef, ViewChild, Renderer2 } from '@angular/core';

@Component({
  selector: "toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {
  @Output() selectedCommunity: EventEmitter<any> = new EventEmitter();
  @Output() tagsChanged: EventEmitter<Array<string>> = new EventEmitter();
  @Output()
  categorySelected: EventEmitter<CategoryInterface> = new EventEmitter();
  @Output()
  subCategorySelected: EventEmitter<SubcategoryInterface> = new EventEmitter();

  @ViewChild("categoriesMenu", { read: ElementRef })
  categoriesMenu: ElementRef;

  tags: Array<string> = [];
  community: any;

  constructor(private userService: UserService, private render: Renderer2) {}

  async ngOnInit() {
    this.community = await this.userService.getCommunityUser();
    console.log(this.community);
  }

  changeSelectComunidad(evt) {
    const name = evt.target.selectedOptions[0].text;
    const id = evt.target.value;
    this.selectedCommunity.emit({ name, id });
  }

  changeTags(evt) {
    this.tagsChanged.emit(this.tags);
  }

  openCategories(evt) {
    this.categoriesMenu.nativeElement.classList.toggle("opened");
    evt.target.classList.toggle("icon-menu");
  }

  selectedCategory(category: CategoryInterface) {
    this.categorySelected.emit(category);
  }

  selectedSubCategory(subCategory: SubcategoryInterface) {
    this.subCategorySelected.emit(subCategory);
  }
}
