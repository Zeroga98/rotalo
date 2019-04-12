import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NavigationTopService } from '../../components/navigation-top/navigation-top.service';

@Component({
  selector: 'filter-products',
  templateUrl: './filter-products.component.html',
  styleUrls: ['./filter-products.component.scss']
})
export class FilterProductsComponent implements OnInit, OnDestroy, AfterViewInit {
  public category;
  constructor(private navigationTopService: NavigationTopService) { }

  ngOnInit() {
    this.categorySubscription();
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
        console.log(this.category);
        if (!this.navigationTopService.getCategory()
        || this.navigationTopService.getCategory()
        && this.navigationTopService.getCategory() != event) {
          this.navigationTopService.setCategory(event);
        }
      }
    });
  }

}
