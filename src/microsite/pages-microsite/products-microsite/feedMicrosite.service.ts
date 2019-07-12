import { Injectable } from '@angular/core';

@Injectable()
export class FeedMicrositeService{
    private readonly initialFilter: Object = {
        'size': 24,
        'number': 1,
        'product_country_id': 1,
        'seller_store_id': 1
    }

    private currentFilter: Object = undefined;

    private configFiltersSubcategory: Object = undefined;

    constructor() {
        this.setCurrentFilter(this.initialFilter);
    }

    getCurrentFilter() {
        return this.currentFilter;
    }

    setCurrentFilter(newFilter) {
        this.currentFilter = newFilter;
    }

    getConfigFiltersSubcategory() {
        return this.configFiltersSubcategory;
    }

    setConfigFiltersSubcategory(config) {
        this.configFiltersSubcategory = config;
    }

    getInitialFilter() {
        return this.initialFilter;
    }

    resetFilter() {
      this.setCurrentFilter(this.initialFilter);
    }
}
