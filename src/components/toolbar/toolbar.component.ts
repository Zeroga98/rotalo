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
  @ViewChild("closeMenu", { read: ElementRef }) closeMenu: ElementRef;
  @ViewChild("closeMenuLabel", { read: ElementRef }) closeMenuLabel: ElementRef;
  @ViewChild("categoriesMenu", { read: ElementRef }) categoriesMenu: ElementRef;
  @ViewChild("autoCompleteBox", { read: ElementRef }) autoCompleteBox: ElementRef;

  public autoCompleteOptions: Array<string> = []
  public tags: Array<string> = [];
  public community: any;
  public communities;

  constructor(
    private userService: UserService,
    private render: Renderer2,
    private toolbarService:ToolbarService,
    private changeDetectorRef: ChangeDetectorRef) {}

  async ngOnInit() {

    if (!this.userService.getCommunitiesCurrent()) {
      this.getCommunities();
    } else {
      this.communities = this.userService.getCommunitiesCurrent();
    }
    this.autoCompleteOptions = this.toolbarService.getAutoCompleteOptions();
    this.community = await this.userService.getCommunityUser();
    this.changeDetectorRef.markForCheck();
  }

  async getCommunities() {
    try {
      const communities = await this.userService.getCommunities();
      this.communities = communities.communities;
      this.userService.setCommunities(this.communities);
    } catch (error) {
      console.error(error);
    }
  }

  changeSelectComunidad(evt) {
    let name;
     if (evt.target.selectedOptions) {
      name = evt.target.selectedOptions[0].text;
    } else {
      name = evt.target.options[evt.target.selectedIndex].text;
    }
    const id = evt.target.value;
    this.selectedCommunity.emit({ name, id });
    this.changeDetectorRef.markForCheck();
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
    this.closeMenu.nativeElement.classList.toggle("gtmCategorias");
    this.closeMenuLabel.nativeElement.classList.toggle("gtmCategorias");
  }

  selectedCategory(category: CategoryInterface) {
    this._closeMenu();
    this.categorySelected.emit(category);
  }

  selectedSubCategory(subCategory: SubcategoryInterface) {
    this._closeMenu();
    this.subCategorySelected.emit(subCategory);
  }

  showAutocomplateOptions() {
    if (this.autoCompleteOptions.length > 0) {
      this.render.addClass(this.autoCompleteBox.nativeElement, 'showed');
    }
  }

  hideAutocomplateOptions(){
    this.render.removeClass(this.autoCompleteBox.nativeElement, 'showed');
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
