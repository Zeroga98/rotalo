import { Component, OnInit, Input } from '@angular/core';
import { ROUTES } from '../../../router/routes';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { NavigationTopServicePublic } from './navigation-top-public.service';
import { FeedShopMicrositeService } from '../../../microsite/pages-microsite/home-shop/feedMicrosite.service';

@Component({
  selector: 'navigation-top-public',
  templateUrl: './navigation-top-public.component.html',
  styleUrls: ['./navigation-top-public.component.scss']
})
export class NavigationTopPublicComponent implements OnInit {
  public suggestList;
  public showSearchMobile = false;
  queryField: FormControl = new FormControl();
  public autoCompleteOptions: Array<string> = [];
  @Input() hideBackArrow: boolean = false;
  constructor( private router: Router,
    private feedService: FeedShopMicrositeService,
    private navigationTopService: NavigationTopServicePublic,) { }

  ngOnInit() {
  }

  onSubmitSearch() {
    this.changeTags();
  }

  changeTags() {
    if (this.queryField.value) {
      this.autoCompleteOptions = this.navigationTopService.addOptions(this.queryField.value);
      this.showSearchMobile = false;
      this.router.navigate([
        `${ROUTES.SHOPS.LINK}/${ROUTES.SHOPS.FEED}`
      ], { queryParams: { product_name: this.queryField.value } });
    }
  }

  openSearch() {
    this.showSearchMobile = !this.showSearchMobile;
  }

  goToHome() {
    const url = `${ROUTES.SHOPS.LINK}/${ROUTES.SHOPS.FEED}`;
    const urlHome = `${ROUTES.HOME}`;
    `/${url}` === this.router.url ? this.router.navigate([urlHome]) : this.router.navigate([url]);
    this.feedService.resetFilter();
    this.queryField.reset();
  }

}
