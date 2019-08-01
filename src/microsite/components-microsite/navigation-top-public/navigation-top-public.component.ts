import { Component, OnInit } from '@angular/core';
import { ROUTES } from '../../../router/routes';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { NavigationTopServicePublic } from './navigation-top-public.service';

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
  constructor( private router: Router,
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

}
