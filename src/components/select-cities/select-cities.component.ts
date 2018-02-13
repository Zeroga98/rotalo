import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { CollectionSelectService } from '../../services/collection-select.service';

@Component({
  selector: 'select-cities',
  templateUrl: './select-cities.component.html',
  styleUrls: ['./select-cities.component.scss']
})
export class SelectCitiesComponent implements OnChanges {
  @Input() state: any = {};
  @Output() selected: EventEmitter<Object> = new EventEmitter();
  cities: Array<any> = [];

  constructor(private collectionService: CollectionSelectService) { }

  ngOnChanges() {
    this.getCities();
  }

  async getCities() {
    if (this.state && this.state.id) {
        this.cities = await this.collectionService.getCitiesById(this.state.id);
    }
  }

  onSelect(ev) {
    const name = ev.target.selectedOptions[0].text;
    const id = ev.target.value;
    this.selected.emit({name, id});
  }

}
