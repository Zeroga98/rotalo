import { CollectionSelectService } from './../../services/collection-select.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'location-select',
    templateUrl: 'location-select.component.html',
    styleUrls: ['location-select.component.scss'],
    providers: [CollectionSelectService]
})
export class LocationSelectComponent implements OnInit {
    @Output() changed: EventEmitter<Object> = new EventEmitter();

    location: Object = {
        country: null,
        city: null,
        state: null
    };
    countries: Array<any> = [];
    states: Array<any> = [];
    cities: Array<any> = [];
    constructor(private collectionService: CollectionSelectService) { }

    ngOnInit(): void {
        this.getCountries();
    }

    async loadStates(ev) {
        this.setLocation('country', ev.target.selectedOptions[0].text);
        this.states = await this.collectionService.getStatesById(ev.target.value);
    }

    async loadCities(ev) {
        this.setLocation('state', ev.target.selectedOptions[0].text);
        this.cities = await this.collectionService.getCitiesById(ev.target.value);
    }

    setCityLocation(ev) {
        this.setLocation('city', ev.target.selectedOptions[0].text);
    }

    async getCountries() {
        try {
            await this.collectionService.isReady();
            this.countries = await this.collectionService.getCountries();
        } catch (error) {
            console.error(error);
        }
    }

    setLocation(key: string, value: string) {
        this.location[key] = value;
        this.emitChanged();
    }

    isCompletedAllSelects() {
        const keys = Object.keys(this.location);
        const keyEmpty = keys.find(key => {
            return this.location[key] == '' || !this.location[key];
        });
        return !keyEmpty;
    }

    emitChanged() {
        this.changed.emit({
            location: this.location,
            completed: this.isCompletedAllSelects()
        });
    }
}
