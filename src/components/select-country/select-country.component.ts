import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {CollectionSelectService} from '../../services/collection-select.service';

@Component({
    selector: 'select-country',
    templateUrl: './select-country.component.html',
    styleUrls: ['./select-country.component.scss']
})
export class SelectCountryComponent implements OnInit {
    @Output() selected: EventEmitter<Object> = new EventEmitter();
    countries: Array < any > = [];
    constructor(private collectionService: CollectionSelectService) {}

    ngOnInit() {
        this.getCountries();
    }

    onSelected(ev) {
        const name = ev.target.selectedOptions[0].text;
        const id = ev.target.value;
        console.log({name, id});
        this.selected.emit({name, id});
    }

    async getCountries() {
        try {
            await this.collectionService.isReady();
            this.countries = await this.collectionService.getCountries();
        } catch (error) {
            console.error(error);
        }
    }
}
