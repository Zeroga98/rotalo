import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { CollectionSelectService } from "../../services/collection-select.service";
@Component({
  selector: "select-country",
  templateUrl: "./select-country.component.html",
  styleUrls: ["./select-country.component.scss"]
})
export class SelectCountryComponent implements OnInit {
    @Output() selected: EventEmitter<Object> = new EventEmitter();
    @Output() loaded: EventEmitter<void> = new EventEmitter();
    @Input() initialValue;

    countries: Array < any > = [];
    currentCountry: String = '';
    constructor(private collectionService: CollectionSelectService) {
    }

    ngOnInit() {
        this.getCountries();
    }

    onSelected(ev) {
        const name = ev.target.selectedOptions[0].text;
        const id = ev.target.value;
        this.selected.emit({name, id});
    }

    async getCountries() {
        try {
            await this.collectionService.isReady();
            this.countries = await this.collectionService.getCountries();
            this.loaded.emit();
            if (this.initialValue) {
              const name = this.initialValue.name;
              const id = this.initialValue.id;
              this.currentCountry = id;
              this.selected.emit({name, id});
            }
        } catch (error) {
            console.error(error);
        }
    }
}

