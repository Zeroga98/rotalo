import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { CollectionSelectService } from "../../services/collection-select.service";
import { CountryInterface } from "./country.interface";
@Component({
  selector: "select-country",
  templateUrl: "./select-country.component.html",
  styleUrls: ["./select-country.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectCountryComponent implements OnInit {
  @Output() selected: EventEmitter<Object> = new EventEmitter();
  @Output() loaded: EventEmitter<void> = new EventEmitter();
  @Input() initialValue: CountryInterface;
  @Input() turnOffInitialEvent: boolean = false;
  countries: Array<any> = [];
  currentCountryId: number | string = "";
  private currentUrl = '';
  constructor(
    private collectionService: CollectionSelectService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.getCountries();
  }

  onSelected(ev) {
    let name;
    name = ev.target.selectedOptions ? ev.target.selectedOptions[0].text :  ev.target.options[ev.target.selectedIndex].text;
    const id = ev.target.value;
    this.selected.emit({ name, id });
    this.changeDetectorRef.markForCheck();
  }

  filterColombiaPanama (countries) {
    const newCountries = countries.filter(country => country['name'] == 'Colombia' || country['name'] == 'Panamá');
    return newCountries;
  }

  filterGuatemala (countries) {
    const newCountries = countries.filter(country => country['name'] == 'Guatemala');
    return newCountries;
  }

  changeArrayCountries(countries) {
    this.currentUrl = window.location.href;
    if (this.currentUrl.includes('gt')) {
      countries = this.filterGuatemala(countries);
    } else {
      countries = this.filterColombiaPanama(countries);
    }
    return countries;
  }

  async getCountries() {
    try {
      await this.collectionService.isReady();
      this.countries = await this.collectionService.getCountries();
      this.countries = this.changeArrayCountries(this.countries);
      this.loaded.emit();
      this.routineToInitialValue();
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      console.error(error , 'getCountries');
    }
  }

  private async routineToInitialValue() {
    if (this.initialValue && this.initialValue.id) {
      this.currentCountryId = this.initialValue.id;
      const country = this.countries.find((country: any) => country.id == this.initialValue.id );
      if(!this.turnOffInitialEvent) this.selected.emit(country);
    }
  }
}

