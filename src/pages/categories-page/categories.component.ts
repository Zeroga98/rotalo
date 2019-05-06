import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { NavigationTopService } from '../../components/navigation-top/navigation-top.service';
import { SubcategoryInterface } from '../../commons/interfaces/subcategory.interface';
import { CategoryInterface } from '../../commons/interfaces/category.interface';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  @ViewChild('categoriesMenu', { read: ElementRef }) categoriesMenu: ElementRef;
  constructor(private navigationTopService: NavigationTopService, ) { }

  ngOnInit() {
  }

  selectedCategory(category: CategoryInterface) {
    this._closeMenu();
    this.navigationTopService.changeCategory(category);
  }

  selectedSubCategory(subCategory: SubcategoryInterface) {
    this._closeMenu();
    this.navigationTopService.changeSubCategory(subCategory);
  }

  public _closeMenu() {
    this.categoriesMenu.nativeElement.classList.remove('opened');
    document.getElementById('back-categories').classList.remove('opened');
  }

  goToTop() {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }

}
