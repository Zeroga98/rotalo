import { Component, Input, Output, OnChanges, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CollectionSelectService } from '../../services/collection-select.service';

@Component({
  selector: 'select-cities',
  templateUrl: './select-cities.component.html',
  styleUrls: ['./select-cities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectCitiesComponent implements OnChanges {
  @Input() state: any = {};
  @Output() selected: EventEmitter<Object> = new EventEmitter();
  @Input() initialValue;
  cities: Array<any> = [];
  currentCity: String = '';

  constructor(private collectionService: CollectionSelectService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnChanges() {
    this.getCities();
  }

  async getCities() {
    if (this.state && this.state.id) {
        this.cities = await this.collectionService.getCitiesById(this.state.id);
        this.currentCity = '';
        if (this.initialValue) {
          if (this.state.id === this.initialValue.state.id) {
            const name  = this.initialValue.name;
            const id = this.initialValue.id;
            this.currentCity = id;
            this.selected.emit({name, id});
          } else {
            const name  = '';
            const id = '';
            this.currentCity = '';
            this.selected.emit({name, id});
          }
        }
    }else {
      const name  = '';
      const id = '';
      this.currentCity = '';
      this.cities = [];
      this.selected.emit({name, id});
    }
    this.changeDetectorRef.markForCheck();
  }

  onSelect(ev) {
    let name;
    if (ev.target.selectedOptions) {
      name = ev.target.selectedOptions[0].text;
    } else {
      name = ev.target.options[ev.target.selectedIndex].text;
    }
    const id = ev.target.value;
    this.selected.emit({name, id});
  }

}
