import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, SimpleChanges } from "@angular/core";
import { CollectionSelectService } from "../../services/collection-select.service";
import { CountryInterface } from "./country.interface";
@Component({
  selector: "select-country",
  templateUrl: "./select-country.component.html",
  styleUrls: ["./select-country.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectCountryComponent implements OnInit, OnChanges {

    @Output() selected: EventEmitter<Object> = new EventEmitter();
    @Output() loaded: EventEmitter<void> = new EventEmitter();
    @Input() initialValue: CountryInterface;
    countries: Array < any > = []; 
    currentCountryId: number | string = '';
    
    constructor(
        private collectionService: CollectionSelectService,
        private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.getCountries();
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log("changes: ", changes);
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
            console.log("countries: ", this.countries);
            this.loaded.emit();
            this.routineToInitialValue();
            this.changeDetectorRef.markForCheck();
        } catch (error) {
            console.error(error);
        }
    }

    private async routineToInitialValue(){
        console.log("initial: ", this.initialValue);
        if (this.initialValue && this.initialValue.id) {
            this.currentCountryId = this.initialValue.id;
            const country = this.countries.find( (country:any) => country.id == this.initialValue.id);
            console.log("emit: ", country);
            this.selected.emit(country);
        }
    }
}

