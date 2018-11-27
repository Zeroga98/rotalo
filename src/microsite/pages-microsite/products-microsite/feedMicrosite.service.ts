import { Injectable } from '@angular/core';

@Injectable()
export class FeedMicrositeService{
    private readonly initialFilter: Object = {
        "filter[country]": 1,
        "filter[community]": -1,
        "page[size]": 24,
        "page[number]": 1
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
}
