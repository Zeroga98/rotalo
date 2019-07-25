import { Component, OnInit } from '@angular/core';
import { ROUTES } from '../../../router/routes';
import { Router } from '@angular/router';
@Component({
  selector: 'navigation-top-public',
  templateUrl: './navigation-top-public.component.html',
  styleUrls: ['./navigation-top-public.component.scss']
})
export class NavigationTopPublicComponent implements OnInit {
  public suggestList;
  constructor( private router: Router) { }

  ngOnInit() {
  }

  goToCategory(suggestion) {
    if (suggestion) {
      if (suggestion.type == 'category') {
        this.router.navigate([
          `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FILTERS}`
        ], { queryParams: { product_category_id: suggestion.idSuggestion } });
      } else {
        this.router.navigate([
          `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FILTERS}`
        ], { queryParams: {  product_category_id: suggestion.categoryId, product_subcategory_id: suggestion.idSuggestion } });
      }
    }
  }

}
