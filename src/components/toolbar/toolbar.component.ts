import { ChangeDetectorRef} from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { SubcategoryInterface } from './../../commons/interfaces/subcategory.interface';
import { CategoryInterface } from './../../commons/interfaces/category.interface';
import { UserService } from './../../services/user.service';
import { Component, OnInit, EventEmitter, Output, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ToolbarService } from './toolbar.service';
import { read } from 'fs';

@Component({
  selector: "toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnInit {
  @Output() selectedCommunity: EventEmitter<any> = new EventEmitter();
  @Output() tagsChanged: EventEmitter<Array<string>> = new EventEmitter();
  @Output() categorySelected: EventEmitter<CategoryInterface> = new EventEmitter();
  @Output() subCategorySelected: EventEmitter<SubcategoryInterface> = new EventEmitter();
  @ViewChild("closeMenu",{ read: ElementRef }) closeMenu: ElementRef;
  @ViewChild("categoriesMenu", { read: ElementRef }) categoriesMenu: ElementRef;
  @ViewChild("autoCompleteBox", { read: ElementRef }) autoCompleteBox: ElementRef;

  autoCompleteOptions: Array<string> = []
  tags: Array<string> = [];
  community: any;

  constructor(
    private userService: UserService,
    private render: Renderer2,
    private toolbarService:ToolbarService,
    private changeDetectorRef: ChangeDetectorRef) {}

  async ngOnInit() {
    this.autoCompleteOptions = this.toolbarService.getAutoCompleteOptions();
    this.community = await this.userService.getCommunityUser();
    this.changeDetectorRef.markForCheck();
  }

  changeSelectComunidad(evt) {
    const name = evt.target.selectedOptions[0].text;
    const id = evt.target.value;
    this.selectedCommunity.emit({ name, id });
  }

  showSearchBar(evt){
    evt.currentTarget.parentElement.classList.add("search-show");
    evt.currentTarget.nextElementSibling.classList.add('full');
  }

  changeTags() {
    this.autoCompleteOptions = this.toolbarService.addOptions(this.tags.join('+'));
    this.tagsChanged.emit(this.tags);
  }

  openCategories(evt) {
    this.categoriesMenu.nativeElement.classList.toggle("opened");
    this.closeMenu.nativeElement.classList.toggle("icon-menu");
  }

  selectedCategory(category: CategoryInterface) {
    this._closeMenu();
    this.categorySelected.emit(category);
  }

  selectedSubCategory(subCategory: SubcategoryInterface) {
    this._closeMenu();
    this.subCategorySelected.emit(subCategory);
  }

  showAutocomplateOptions(){
    if(this.autoCompleteOptions.length > 0){
      this.render.addClass(this.autoCompleteBox.nativeElement,'showed');
    }
  }

  hideAutocomplateOptions(){
    this.render.removeClass(this.autoCompleteBox.nativeElement,'showed');
  }

  clickOptionAutocomplete(option: string){
    this.tags = option.split('+');
    this.changeTags();
  }

  private _closeMenu() {
    this.categoriesMenu.nativeElement.classList.remove("opened");
    this.closeMenu.nativeElement.classList.add("icon-menu");
  }
}
