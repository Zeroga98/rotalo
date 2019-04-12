import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
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

  }

  ngAfterViewInit() {
    this.categorySubscription();
  }

  ngOnDestroy() {
    this.navigationTopService.setCategory(undefined);
  }

  categorySubscription() {
    this.navigationTopService.currentEventCategory.subscribe(event => {
      if (event) {
        if(!this.navigationTopService.getCategory()
        || this.navigationTopService.getCategory()
        && this.navigationTopService.getCategory() != event) {
          this.navigationTopService.setCategory(event);
          this.category = event;

        }
      }
    });
  }

}
