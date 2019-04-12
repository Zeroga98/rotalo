import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationTopService } from '../../components/navigation-top/navigation-top.service';

@Component({
  selector: 'filter-products',
  templateUrl: './filter-products.component.html',
  styleUrls: ['./filter-products.component.scss']
})
export class FilterProductsComponent implements OnInit, OnDestroy {
  public category;
  constructor(private navigationTopService: NavigationTopService) { }
  ngOnInit() {
    this.categorySubscription();
  }

  ngOnDestroy() {
    this.navigationTopService.resetFilter();
  }

  categorySubscription() {
    this.navigationTopService.currentEventCategory.subscribe(event => {
      if (event) {
        console.log(event);
       // this.selectedCategory(event);
      }
    })
  }

}
